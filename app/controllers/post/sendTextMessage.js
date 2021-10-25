const request = require('request');
const config = require('config');
const logger = require('../../functions/bunyan');
const checkHoneypot = require('../../functions/honeypot');
const hasTimedOut = require('../../functions/timeoutRedirect');
const checkBlank = require('../../functions/sanitise/isFieldBlank');
const checkMobile = require('../../functions/sanitise/validateMobileNumber');
const sessionExpiry = require('../../functions/refreshSessionExpiryTime.js');

function apiOptions(fitnote) {
  return {
    url: `${config.get('api.url')}/mobile`,
    method: 'POST',
    json: true,
    timeout: 240000,
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json',
    },
    body: fitnote,
  };
}

function apiCallback(req, res, logType) {
  const errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
  return function callback(err, response) {
    sessionExpiry.refreshTime(res, logType);
    if (!err) {
      logType.info(`Response Received: ${response.statusCode}`);

      if (response.statusCode === 200 || response.statusCode === 201) {
        logType.info('Submitted form data successfully');
        res.redirect('/check-your-answers');
      } else {
        logType.error(err);
        res.render(errorUrl);
      }
    } else {
      logType.error(err);
      res.render(errorUrl);
    }
  };
}

function handleErrors(res, textMessageDoneValue) {
  res.redirect(`/text-message?text=${textMessageDoneValue}`);
}

function logInvalidMobileChars(mobileNumber, logType) {
  const start = mobileNumber.substring(0, 1);
  const end = mobileNumber.substring(1);
  const invalidChars = start.replace(/[+ 0-9]/, '') + end.replace(/[ 0-9]/g, '');
  logType.info(`Mobile number invalid chars: ${invalidChars}`);
}

function hasTextMessagePassed(req, res, logType) {
  const textPermission = req.body.textReminder;
  const mobRaw = req.body.mobileNumberField;
  let newMobile = mobRaw;
  const isMobBlank = checkBlank.notBlank(mobRaw);
  const validMobile = checkMobile.mobileValidate(mobRaw);
  const fitnote = {
    sessionId: req.cookies.sessionId,
  };

  if (typeof textPermission !== 'undefined') {
    if ((textPermission === 'Yes') && (isMobBlank === false)) {
      logType.info('Blank mobile number');
      return handleErrors(res, 1);
    }
    if ((textPermission === 'Yes') && !validMobile) {
      logType.info('Mobile number format');
      // The call to the logging function below is included only for a short period of
      // investigating what users are inputting into the mobile telephone number field.
      // Added in July 2018. To be remove when investigation complete
      logInvalidMobileChars(mobRaw, logType);
      return handleErrors(2);
    }
    if (textPermission === 'No') {
      newMobile = '';
    }
    fitnote.mobileNumber = newMobile;
    return request(apiOptions(fitnote), apiCallback(req, res, logType));
  }
  return handleErrors(0);
}

function sendTextMessageConfirmation(req, res) {
  let redirectUrl;
  const logType = logger.child({ widget: 'postTextMobile' });
  const fakeLandlineRaw = req.body.landlineField;
  const passedHoneypot = checkHoneypot.honeypot(fakeLandlineRaw, 'BOT: honeypot detected a bot, Text Message Page, Landline Field');

  if (typeof req.cookies.sessionId !== 'undefined') {
    logType.info(`Passed Honeypot ${passedHoneypot}`);
    if (passedHoneypot === false) {
      logType.info('BOT detected. Doing fake send');
      res.redirect('/complete'); // don't post the request just go to the final page.
    } else {
      hasTextMessagePassed(req, res, logType);
    }
  } else {
    redirectUrl = hasTimedOut.redirectTimeout('no valid session');
    res.redirect(redirectUrl);
  }
}

module.exports.sendTextMessageConfirmation = sendTextMessageConfirmation;
