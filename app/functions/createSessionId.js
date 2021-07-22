const {v1 : uuidV1} = require('uuid');
const config = require('config');

exports.createSessionId = function createSessionId(req, res) {
    var uuid = uuidV1();
    var expires = new Date(Date.now() + config.get('sessionInfo.expiryPeriod'));
    logger.info('Session ID and Expiry generated');
    res.cookie('sessionId', uuid, {httpOnly : true, secure : config.get('cookieOptions.secure') === 'true', sameSite : true, expires : expires});
    res.cookie('exp', expires.toUTCString(), {httpOnly : true, secure : config.get('cookieOptions.secure') === 'true', sameSite : true, expires : 0});

    res.locals.exp = expires.toUTCString();
    res.locals.lang = req.language || 'en';

    return uuid;
};
