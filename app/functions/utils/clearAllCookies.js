const config = require('config');
const logger = require('../bunyan');
const { COOKIE_CONSENT_CHOICE } = require('../../constants');

const requiredCookies = ['sessionId', 'exp', 'route', COOKIE_CONSENT_CHOICE];

const clearCookie = (req, res, cookieName, options = false) => {
  if (cookieName in req.cookies) {
    res.clearCookie(cookieName, options);
    logger.info(`cookie cleared: ${cookieName}`);
  }
};

/**
 * Clears all cookies (apart from the cookie_consent and sessionID).
 *
 * @param {*} req - Express request object.
 * @param {*} res - Express response object.
 */
const clearAllCookies = (req, res) => {
  Object.getOwnPropertyNames(req.cookies).forEach((cookieName) => {
    logger.info(`found cookie: ${cookieName}`);
    if (!requiredCookies.includes(cookieName)) {
      const options = {};
      if (cookieName.startsWith('_ga') || cookieName.startsWith('_gid')) {
        options.domain = config.get('GTM.domain');
      }
      clearCookie(req, res, cookieName, options);
      clearCookie(req, res, cookieName);
      clearCookie(req, res, cookieName, { domain: '.dwp.gov.uk' });
    } else {
      logger.info(`skipped cookie: ${cookieName}`);
    }
  });
};

module.exports = {
  clearAllCookies,
};
