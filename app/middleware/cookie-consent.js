const logger = require('../functions/bunyan');
const {
    COOKIE_CONSENT_CHOICE, COOKIE_UPDATE_QUERY_PARAM
} = require('../constants');

/**
 * Cookie consent middleware
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @todo move functionality from: `functions/hasViewedCookieMessage` and `functions/updateCookieSettings` to here
 */
const CookieConsent = function(req, res, next) {
    const staticPatt = /^\/(assets|stylesheets|images|javascript)/gi;
    if (staticPatt.test(req.path)) {
        logger.debug('Skipping static path');
        next();
        return;
    }
    const defaults = {
        COOKIE_CONSENT_CHOICE : null
    };
    const cookies = Object.assign({}, defaults, req.cookies);

    const noChoiceMade = () => (!cookies[COOKIE_CONSENT_CHOICE] || cookies[COOKIE_CONSENT_CHOICE] === null);
    res.locals.showCookieConstentMessage = noChoiceMade();
    res.locals.showCookieChoiceConfirmationBanner = parseInt(req.query[COOKIE_UPDATE_QUERY_PARAM], 10) === 1;
    res.locals.cookiesConsented = cookies[COOKIE_CONSENT_CHOICE];
    res.locals.currentPage = req.path;
    res.locals.previousPage = req.query.previousPage;
    next();
};

module.exports = CookieConsent;
