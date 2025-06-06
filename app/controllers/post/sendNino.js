import request from 'request';
import config from 'config';
import logger from '../../functions/bunyan.js';
import isSanitised from '../../functions/sanitise/sanitiseNino.js';
import checkNino from '../../functions/sanitise/validateNinoStrict.js';
import hasTimedOut from '../../functions/timeoutRedirect.js';
import checkBlank from '../../functions/sanitise/isFieldBlank.js';
import checkHoneypot from '../../functions/honeypot.js';
import sessionExpiry from '../../functions/refreshSessionExpiryTime.js';

function apiOptions(fitnote) {
  return {
    url: `${config.get('api.url')}/nino`,
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

function processRequest(req, res, logType) {
  logType.info('Submitted form data successfully');
  const previousPageCYA = req.body.previousPage;
  if (previousPageCYA === '1') {
    res.redirect('/check-your-answers');
  } else {
    res.redirect('/address');
  }
}

function apiCallback(req, res, logType) {
  return function callback(err, response) {
    sessionExpiry(res, logType);
    if (!err) {
      logType.info(`Response Received: ${response.statusCode}`);
      if (response.statusCode === 200 || response.statusCode === 201) {
        processRequest(req, res, logType);
      } else {
        res.status(500).redirect('/500');
      }
    } else {
      logType.debug(`Error${err}`);
      res.status(500).redirect('/500');
    }
  };
}

function sendNino(req, res) {
  let ninoDone;
  const logType = logger.child({ widget: 'postNino' });
  const ninoRaw = req.body.ninoField;
  const isNinoBlank = checkBlank(ninoRaw);
  const fakeEmailRaw = req.body.emailField;
  const convertedNino = isSanitised(ninoRaw);
  const passedNino = checkNino(convertedNino);
  const passedHoneypot = checkHoneypot(fakeEmailRaw, 'BOT: honeypot detected a bot, Nino Page, Email Field');
  let redirectUrl;

  const fitnote = {
    sessionId: req.cookies.sessionId,
    nino: ninoRaw.trim(),
  };

  function handleErrors(ninoDoneValue) {
    ninoDone = ninoDoneValue;
    res.redirect(`nino?nino=${ninoDone}`);
  }

  function hasNinoPassed() {
    if (isNinoBlank === false) {
      logType.info('Blank Nino');
      return handleErrors(0);
    }

    if (passedNino === false) {
      logType.info('Nino Invalid');
      return handleErrors(1);
    }
    return request(apiOptions(fitnote), apiCallback(req, res, logType));
  }

  if (typeof req.cookies.sessionId !== 'undefined') {
    logType.info(`Passed Honeypot ${passedHoneypot}`);
    if (passedHoneypot === false) {
      logType.info('BOT detected. Doing fake send');
      res.redirect('/address'); // don't post the request just go to the next page.
    } else {
      hasNinoPassed();
    }
  } else {
    redirectUrl = hasTimedOut('no valid session');
    res.redirect(redirectUrl);
  }
}

export default sendNino;
