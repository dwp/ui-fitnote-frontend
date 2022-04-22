const config = require('config');
const request = require('request');
const logger = require('../../functions/bunyan');
const getLanguage = require('../../functions/getLanguage');
const enErrors = require('../../locales/en/errors.json');
const cyErrors = require('../../locales/cy/errors.json');

function apiOptions(req) {
  return {
    url: `${config.get('api.url')}/queryNino`,
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
  let ninoError;
  let ninoFormatError;
  if (req.query.nino === '0') {
    ninoError = {
      message: req.i18nTranslator.t('errors:nino.nino'),
      field: 'ninoFieldID',
    };
  }

  if (req.query.nino === '1') {
    ninoFormatError = {
      message: req.i18nTranslator.t('errors:nino.nino-format'),
      field: 'ninoFieldID',
    };
  }

  if ((req.query.nino === '0') || (req.query.nino === '1')) {
    errorMessage = {
      nino: ninoError,
      ninoFormat: ninoFormatError,
    };
  } else {
    errorMessage = '';
  }

  return errorMessage;
}

function getRoute(req) {
  let route;
  if (typeof req.cookies.route !== 'undefined') {
    if (req.cookies.route === 'upload-digital') {
      route = 'upload?ref=digital';
    } else if (req.cookies.route === 'upload-paper') {
      route = 'upload?ref=paper';
    } else {
      route = req.cookies.route;
    }
  } else {
    route = 'take';
  }

  return route;
}

function ninoPage(req, res) {
  const logType = logger.child({ widget: 'ninoPage' });
  let nino = '';
  const validationErrors = getLanguage(req.language) === 'en' ? JSON.stringify(enErrors) : JSON.stringify(cyErrors);
  const route = getRoute(req);
  let previousPageCYA = 0;
  const hasRefProperty = Object.prototype.hasOwnProperty.call(req.query, 'ref');
  if (hasRefProperty) {
    previousPageCYA = req.query.ref === 'check-your-answers' ? 1 : 0;
  }

  function callback(err, response, body) {
    if (!err && response.statusCode === 200) {
      nino = body.nino;
      const errors = getErrorMessage(req);
      res.render('nino', {
        sessionId: req.cookies.sessionId,
        version: process.env.npm_package_version,
        environment: config.util.getEnv('NODE_ENV'),
        timeStamp: Date.now(),
        previousPageCYA,
        route,
        nino,
        errors,
        validationErrors,
      });
    } else {
      logType.error(`Response.statusCode from /queryNino api is ${response.statusCode}`);
      res.render('errors/500');
    }
  }

  request(apiOptions(req), callback);
}

module.exports.ninoPage = ninoPage;
