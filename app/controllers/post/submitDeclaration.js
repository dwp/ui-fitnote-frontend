import request from 'request';
import config from 'config';
import logger from '../../functions/bunyan.js';
import hasTimedOut from '../../functions/timeoutRedirect.js';

function submitDeclaration(req, res) {
  const logType = logger.child({ widget: 'confirmation' });
  let redirectUrl;
  const fitnote = {
    sessionId: req.cookies.sessionId,
    accepted: true,
  };

  const options = {
    url: `${config.get('api.url')}/declaration`,
    method: 'POST',
    json: true,
    timeout: 240000,
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json',
    },
    body: fitnote,
  };

  function processRequest() {
    logType.info('Submitted form data successfully');
    res.redirect('/complete');
  }

  function handleFormError(err, errorMsg) {
    logType.fatal(`${errorMsg}:${err}`);
    res.status(500).redirect('/500');
  }

  function callback(err, response, body) {
    if (!err) {
      logType.info(`Response Received: ${response.statusCode}`);
      switch (response.statusCode) {
        case 200:
        case 201:
          processRequest();
          break;
        case 400:
          handleFormError(body, 'Problem with submitted form data');
          break;
        default:
          handleFormError(body, 'API not responding ');
      }
    } else {
      handleFormError(err, 'API not responding ');
    }
  }

  if (typeof req.cookies.sessionId !== 'undefined') {
    request(options, callback);
  } else {
    redirectUrl = hasTimedOut('no valid session');
    res.redirect(redirectUrl);
  }
}

export default submitDeclaration;
