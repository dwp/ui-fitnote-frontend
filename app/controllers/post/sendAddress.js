const request = require('request');
const config = require('config');
const logger = require('../../functions/bunyan');
const isSanitised = require('../../functions/sanitise/sanitiseField');
const hasTimedOut = require('../../functions/timeoutRedirect');
const checkBlank = require('../../functions/sanitise/isFieldBlank');
const checkHoneypot = require('../../functions/honeypot');
const validatePostcode = require('../../functions/sanitise/validatePostcode');
const sessionExpiry = require('../../functions/refreshSessionExpiryTime.js');

function apiOptions(fitnote) {
  return {
    url: `${config.get('api.url')}/address`,
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

function validateHouseNumber(req) {
  let houseNumberValid;
  const houseNumberRaw = req.body.houseNumberField;
  const ishouseNumberBlank = checkBlank.notBlank(houseNumberRaw);
  if (ishouseNumberBlank === false) {
    houseNumberValid = 0;
  } else {
    houseNumberValid = 1;
  }

  return houseNumberValid;
}

function validateForm(req) {
  let formValid;
  const postcodeRaw = req.body.postcodeField;
  const postcodeSanitised = isSanitised.sanitiseField(postcodeRaw);
  const postcodeValid = validatePostcode.validatePostcode(postcodeSanitised.toUpperCase());
  const houseNumberValid = validateHouseNumber(req);
  if ((houseNumberValid === 1) && (postcodeValid === 1)) {
    formValid = true;
  } else {
    formValid = false;
  }

  return formValid;
}

function processRequest(req, res, logType) {
  logType.info('Submitted form data successfully');
  const previousPageCYA = req.body.previousPage;
  if (previousPageCYA === '1') {
    res.redirect('/check-your-answers');
  } else {
    res.redirect('/text-message');
  }
}

function apiCallback(req, res, logType) {
  const errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
  function handleFormError() {
    logType.info('Form Fields Invalid');
    res.redirect('address?houseNumber=0&postcode=0');
  }

  return function callback(err, response) {
    sessionExpiry.refreshTime(res, logType);
    if (!err) {
      logType.info(`Response Received: ${response.statusCode}`);
      switch (response.statusCode) {
        case 200:
        case 201:
          processRequest(req, res, logType);
          break;
        default:
          handleFormError();
      }
    } else {
      logType.debug(`Error${err}`);
      res.status(500).render(errorUrl);
    }
  };
}

function sendAddress(req, res) {
  let redirectUrl;
  const logType = logger.child({ widget: 'postAddress' });
  const houseNumberRaw = req.body.houseNumberField;
  const postcodeRaw = req.body.postcodeField;
  const postcodeSanitised = isSanitised.sanitiseField(postcodeRaw);
  const postcodeValid = validatePostcode.validatePostcode(postcodeSanitised.toUpperCase());
  const fakeCountyRaw = req.body.countyField;
  const passedHoneypot = checkHoneypot.honeypot(fakeCountyRaw, 'BOT: honeypot detected a bot, Address Page, County Field');
  const fitnote = {
    sessionId: req.cookies.sessionId,
    houseNameOrNumber: houseNumberRaw.trim(),
    postcode: postcodeSanitised.toUpperCase(),
  };

  const houseNumberValid = validateHouseNumber(req);
  const formValid = validateForm(req);

  if (typeof req.cookies.sessionId !== 'undefined') {
    logger.info(`Passed Honeypot ${passedHoneypot}`);

    if (passedHoneypot === false) {
      logType.info('BOT detected. Doing fake send');
      res.redirect('/text-message'); // don't post the request just go to the next page.
    } else if (passedHoneypot === true && formValid === true) {
      request(apiOptions(fitnote), apiCallback(req, res, logType));
    } else {
      logType.info('Form Fields Invalid');
      res.redirect(`address?houseNumber=${houseNumberValid}&postcode=${postcodeValid}`);
    }
  } else {
    redirectUrl = hasTimedOut.redirectTimeout('no valid session');
    res.redirect(redirectUrl);
  }
}

module.exports.sendAddress = sendAddress;
