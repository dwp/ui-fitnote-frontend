import config from 'config';
import logger from '../../functions/bunyan.js';
import createSessionId from '../../functions/createSessionId.js';
import retryCookie from '../../functions/retryCookie.js';
import getLanguage from '../../functions/getLanguage.js';
import enErrors from '../../locales/en/errors.json' with { type: 'json' };
import cyErrors from '../../locales/cy/errors.json' with { type: 'json' };

function fitnoteNeededPage(req, res) {
  const validationErrors = getLanguage(req.language) === 'en' ? JSON.stringify(enErrors) : JSON.stringify(cyErrors);
  let previousPageCYA = 0;
  const hasRefProperty = Object.prototype.hasOwnProperty.call(req.query, 'ref');

  if (hasRefProperty) {
    if (req.query.ref === 'no-fit-note-needed') {
      previousPageCYA = -1;
    }
    if (req.query.ref === 'method-obtained') {
      previousPageCYA = 1;
    }
  }
  logger.info('Creating Session ID');
  const sessionId = createSessionId(req, res);
  retryCookie(req, res);

  res.render('fitnote-needed', {
    sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    previousPageCYA,
    environment: config.util.getEnv('NODE_ENV'),
    validationErrors,
  });
}

export default fitnoteNeededPage;
