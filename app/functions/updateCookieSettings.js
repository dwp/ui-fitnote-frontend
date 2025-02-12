const url = require('url');
const config = require('config');
const { COOKIE_CONSENT_CHOICE, COOKIE_UPDATE_QUERY_PARAM } = require('../constants');
const { clearAllCookies } = require('./utils/clearAllCookies');
const allowedUrls = require('./whiteListValidateRedirect');

const logger = require('./bunyan');

exports.updateCookieSettings = function updateCookieSettings(req, res) {
  const cookieLength = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
  const sameSite = true;
  const cookieConsentRaw = req.body.consent;
  const cookieConsentValid = (cookieConsentRaw === 'true' || cookieConsentRaw === 'false');
  const userDidNotConsent = req.body.consent !== 'true';
  let redirectPath; let
    redirectUrl;

  if (cookieConsentValid) {
    res.cookie(COOKIE_CONSENT_CHOICE, cookieConsentRaw, {
      httpOnly: true,
      secure: config.get('cookieOptions.secure'),
      sameSite,
      expires: cookieLength,
    });
    // clear GTM cookies if user rejected tracking
    if (userDidNotConsent) {
      clearAllCookies(req, res);
    }

    res.locals.showCookieChoiceConfirmationBanner = true;

    logger.info(`cookies_agreed created value=${cookieConsentRaw}`);
  }

  const qs = {};
  qs[COOKIE_UPDATE_QUERY_PARAM] = 1;

  if (req.body.previousPage) {
    redirectPath = req.body.previousPage;
    redirectUrl = url.format({
      pathname: redirectPath,
      query: { ...qs },
    });
    if (allowedUrls.includes(redirectUrl)
      || allowedUrls.some((allowedUrl) => redirectUrl.startsWith(allowedUrl))) {
      return res.redirect(redirectUrl);
    }
    return res.status(500).render('errors/500');
  }
  redirectUrl = url.format({
    pathname: 'cookies/cookie_policy',
    query: { ...qs },
  });
  return res.redirect(redirectUrl);
};
