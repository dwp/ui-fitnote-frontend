const request = require('request');
const config = require('config');
const logger = require('../../functions/bunyan');
const getLanguage = require('../../functions/getLanguage');
const enErrors = require('../../locales/en/errors.json');
const cyErrors = require('../../locales/cy/errors.json');

function apiOptions(req) {
  return {
    url: `${config.get('api.url')}/queryMobile`,
    method: 'POST',
    json: true,
    timeout: 240000,
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json',
    },
    body: { sessionId: req.cookies.sessionId },
  };
}

function getErrorMessage(req) {
  let errorMessage;
  let textMessageError;
  let textMessageMobileError;
  let textMessageFormatError;

  switch (req.query.text) {
    case '0':
      textMessageError = {
        message: req.i18nTranslator.t('errors:text-message.missing'),
        field: 'mobileNumberID',
      };
      break;
    case '1':
      textMessageMobileError = {
        message: req.i18nTranslator.t('errors:text-message.mobile'),
        field: 'mobileNumberID',
      };
      break;
    case '2':
      textMessageFormatError = {
        message: req.i18nTranslator.t('errors:text-message.format'),
        field: 'mobileNumberID',
      };
      break;
    default:
      textMessageError = {};
      textMessageMobileError = {};
      textMessageFormatError = {};
      break;
  }

  if (req.query.text === '0') {
    errorMessage = {
      radioMessage: textMessageError,
    };
  } else if ((req.query.text === '1') || (req.query.text === '2')) {
    errorMessage = {
      textMessageMobile: textMessageMobileError,
      textMessageFormat: textMessageFormatError,
    };
  } else {
    errorMessage = '';
  }

  return errorMessage;
}

function textMessagePage(req, res) {
  const logType = logger.child({ widget: 'textMessagePage' });
  let mobile;
  const validationErrors = getLanguage(req.language) === 'en' ? JSON.stringify(enErrors) : JSON.stringify(cyErrors);
  let previousPageCYA = 0;

  const hasRefProperty = Object.prototype.hasOwnProperty.call(req.query, 'ref');
  if (hasRefProperty) {
    previousPageCYA = req.query.ref === 'check-your-answers' ? 1 : 0;
  }

  function callback(err, response, body) {
    if (!err && response.statusCode === 200) {
      mobile = body.mobileNumber;
      const errors = getErrorMessage(req);
      res.render('text-message', {
        sessionId: req.cookies.sessionId,
        version: process.env.npm_package_version,
        environment: config.util.getEnv('NODE_ENV'),
        timeStamp: Date.now(),
        mobile,
        previousPageCYA,
        errors,
        validationErrors,
      });
    } else {
      logType.error(`Response.statusCode from /queryMobile api is ${response.statusCode}`);
      res.render('errors/500');
    }
  }

  request(apiOptions(req), callback);
}

module.exports.textMessagePage = textMessagePage;
