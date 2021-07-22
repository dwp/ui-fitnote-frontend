const url = require('url');    
const config = require('config');
const {COOKIE_CONSENT_CHOICE, COOKIE_UPDATE_QUERY_PARAM} = require('../constants');
const {clearAllCookies} = require('./utils/clearAllCookies');
const whiteListValidateRedirect = require('./whiteListValidateRedirect');

const logger = require(appRootDirectory + '/app/functions/bunyan');

exports.hasViewedCookieMsg = function hasViewedCookieMsg(req, res) {
    const cookieLength = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
    const sameSite = true;
    const userDidNotConsent = req.query.consent !== 'true';

    res.cookie(COOKIE_CONSENT_CHOICE, req.query.consent, {
        httpOnly : true,
        secure : config.get('cookieOptions.secure') === 'true',
        sameSite : sameSite,
        expires : cookieLength
    });
    // clear GTM cookies if user rejected tracking
    if (userDidNotConsent) {
        clearAllCookies(req, res);
    }
    
    logger.info(`cookies_agreed created value=${req.query.consent}`);
    const qs = Object.assign({}, req.query);
    let redirectUrl;
    const redirectPath = whiteListValidateRedirect(qs.postback);
    qs[COOKIE_UPDATE_QUERY_PARAM] = 1;
    delete qs.postback;
    if (redirectPath) {
        redirectUrl = url.format({
            pathname : redirectPath,
            query : Object.assign({}, qs)
        });
        return res.redirect(redirectUrl);
    } else {
        return res.status(500).render('errors/500');
    }
};
