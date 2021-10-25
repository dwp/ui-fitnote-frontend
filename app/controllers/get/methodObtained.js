const config = require('config');
const getLanguage = require('../../functions/getLanguage');
const enErrors = require('../../locales/en/errors.json');
const cyErrors = require('../../locales/cy/errors.json');

function methodObtainedPage(req, res) {
  const validationErrors = getLanguage(req.language) === 'en' ? JSON.stringify(enErrors) : JSON.stringify(cyErrors);
  let previousPageCYA = 0;
  const hasRefProperty = Object.prototype.hasOwnProperty.call(req.query, 'ref');
  if (hasRefProperty) {
    if (req.query.ref === 'guidance-digital') {
      previousPageCYA = 1;
    }
    if (req.query.ref === 'guidance-paper') {
      previousPageCYA = 2;
    }
  }
  res.render('method-obtained', {
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    previousPageCYA,
    environment: config.util.getEnv('NODE_ENV'),
    validationErrors,
  });
}

module.exports.methodObtained = methodObtainedPage;
