import url from 'url';
import config from 'config';
import { COOKIE_CONSENT_CHOICE, COOKIE_UPDATE_QUERY_PARAM } from '../constants.js';
import clearAllCookies from './utils/clearAllCookies.js';
import { allowedUrls } from './whiteListValidateRedirect.js';

import logger from './bunyan.js';

export default function hasViewedCookieMsg(req, res) {
  const cookieLength = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
  const sameSite = true;
  const userDidNotConsent = req.query.consent !== 'true';

  res.cookie(COOKIE_CONSENT_CHOICE, req.query.consent, {
    httpOnly: true,
    secure: config.get('cookieOptions.secure'),
    sameSite,
    expires: cookieLength,
  });
  // clear GTM cookies if user rejected tracking
  if (userDidNotConsent) {
    clearAllCookies(req, res);
  }

  logger.info(`cookies_agreed created value=${req.query.consent}`);
  const qs = { ...req.query };
  const redirectPath = qs.postback;
  qs[COOKIE_UPDATE_QUERY_PARAM] = 1;
  delete qs.postback;

  const redirectUrl = url.format({
    pathname: redirectPath,
    query: { ...qs },
  });

  if (allowedUrls.includes(redirectUrl)
    || allowedUrls.some((allowedUrl) => redirectUrl.startsWith(allowedUrl))) {
    return res.redirect(redirectUrl);
  }
  return res.status(500).render('errors/500');
}
