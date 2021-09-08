const uid = require('uid-safe').sync;
const config = require('config');

function generateId() {
    return uid(24);
}

exports.createSessionId = function createSessionId(req, res) {
    const id = generateId();
    const expires = new Date(Date.now() + config.get('sessionInfo.expiryPeriod'));
    logger.info('Session ID and Expiry generated');
    res.cookie('sessionId', id, {httpOnly : true, secure : config.get('cookieOptions.secure') === 'true', sameSite : true, expires : expires});
    res.cookie('exp', expires.toUTCString(), {httpOnly : true, secure : config.get('cookieOptions.secure') === 'true', sameSite : true, expires : 0});

    res.locals.exp = expires.toUTCString();
    res.locals.lang = req.language || 'en';

    return id;
};
