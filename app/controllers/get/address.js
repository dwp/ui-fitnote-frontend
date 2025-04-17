import request from 'request';
import config from 'config';
import logger from '../../functions/bunyan.js';
import getLanguage from '../../functions/getLanguage.js';

import enErrors from '../../locales/en/errors.json' with { type: 'json' };
import cyErrors from '../../locales/cy/errors.json' with { type: 'json' };

function apiOptions(req) {
  return {
    url: `${config.get('api.url')}/queryAddress`,
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
  let houseNumberError;
  let postcodeError;
  let postcodeFormatError;
  let errorMessage;

  if (req.query.houseNumber === '0') {
    houseNumberError = {
      message: req.i18nTranslator.t('errors:address.house-number'),
      field: 'houseNumberID',
    };
  }

  if (req.query.postcode === '0') {
    postcodeFormatError = {
      message: req.i18nTranslator.t('errors:address.postcode-format'),
      field: 'postcodeID',
    };
  }

  if (req.query.postcode === '2') {
    postcodeError = {
      message: req.i18nTranslator.t('errors:address.postcode'),
      field: 'postcodeID',
    };
  }

  if ((req.query.houseNumber !== '0') && (req.query.postcode !== '0') && (req.query.postcode !== '2')) {
    errorMessage = '';
  } else {
    errorMessage = {
      houseNumber: houseNumberError,
      postcode: postcodeError,
      postcodeFormat: postcodeFormatError,
    };
  }

  return errorMessage;
}

function addressPage(req, res) {
  const logType = logger.child({ widget: 'addressPage' });
  let house = '';
  let postcode = '';
  let previousPageCYA = 0;
  const validationErrors = getLanguage(req.language) === 'en' ? JSON.stringify(enErrors) : JSON.stringify(cyErrors);

  const hasRefProperty = Object.prototype.hasOwnProperty.call(req.query, 'ref');
  if (hasRefProperty) {
    previousPageCYA = req.query.ref === 'check-your-answers' ? 1 : 0;
  }

  function callback(err, response, body) {
    if (!err && response.statusCode === 200) {
      house = body.claimantAddress.houseNameOrNumber;
      postcode = body.claimantAddress.postcode;
      const errors = getErrorMessage(req);
      res.render('address', {
        sessionId: req.cookies.sessionId,
        version: process.env.npm_package_version,
        environment: config.util.getEnv('NODE_ENV'),
        timeStamp: Date.now(),
        house,
        postcode,
        previousPageCYA,
        errors,
        validationErrors,
      });
    } else {
      logType.error(`Response.statusCode from /queryAddress api is ${response.statusCode}`);
      res.render('errors/500');
    }
  }

  request(apiOptions(req), callback);
}

export default addressPage;
