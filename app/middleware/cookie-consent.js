const logger = require('../functions/bunyan');
const {
  COOKIE_CONSENT_CHOICE, COOKIE_UPDATE_QUERY_PARAM,
} = require('../constants');

function noChoiceMade(cookies) {
  return !cookies[COOKIE_CONSENT_CHOICE] || cookies[COOKIE_CONSENT_CHOICE] === null;
}

function CookieConsent(req, res, next) {
  const staticPatt = /^\/(assets|stylesheets|images|javascript)/gi;
  if (staticPatt.test(req.path)) {
    logger.debug('Skipping static path');
    next();
    return;
  }
  const defaults = {
    COOKIE_CONSENT_CHOICE: null,
  };
  const cookies = { ...defaults, ...req.cookies };
  const updateCookieParam = parseInt(req.query[COOKIE_UPDATE_QUERY_PARAM], 10) === 1;
  res.locals.showCookieConstentMessage = noChoiceMade(cookies);
  res.locals.showCookieChoiceConfirmationBanner = updateCookieParam;
  res.locals.cookiesConsented = cookies[COOKIE_CONSENT_CHOICE];
  res.locals.currentPage = req.path;
  res.locals.previousPage = req.query.previousPage;
  next();
}

module.exports = CookieConsent;
