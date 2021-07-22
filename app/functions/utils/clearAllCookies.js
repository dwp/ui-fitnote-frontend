/* eslint-disable no-console */
const config = require('config');
const {COOKIE_CONSENT_CHOICE} = require('../../constants');
const requiredCookies = ['sessionId', 'exp', 'route', COOKIE_CONSENT_CHOICE];

const clearCookie = (req, res, cookieName, options = false) => {
    if (cookieName in req.cookies) {
        res.clearCookie(cookieName, options);
        console.log('cookie cleared: ', cookieName);
    }
};

/**
 * clears all cookies (apart from the cookie_consent and sessionID)
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
const clearAllCookies = (req, res) => {
    console.clear();
    console.table(req.cookies);
    Object.getOwnPropertyNames(req.cookies).forEach((cookieName) => {
        console.log('found cookie ', cookieName);
        if (!requiredCookies.includes(cookieName)) {
            const options = {};
            if (cookieName.startsWith('_ga') || cookieName.startsWith('_gid')) {
                options.domain = config.get('GTM.domain');
            }
            clearCookie(req, res, cookieName, options);
            clearCookie(req, res, cookieName);
            clearCookie(req, res, cookieName, {domain : '.dwp.gov.uk'});
        } else {
            console.log(`skipped cookie: ${cookieName}`);
        }
    });
};

module.exports = {
    clearAllCookies
};
