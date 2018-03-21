var uuidV1 = require('uuid/v1');

exports.createSessionId = function createSessionId(req, res) {
    var uuid = uuidV1();
    var expires = new Date(Date.now() + (30 * 60 * 1000));
    logger.info('Session ID generated');
    res.cookie('sessionId', uuid, {httpOnly : true, secure : true, sameSite : true, expires : expires});
    res.cookie('exp', expires.toUTCString(), {httpOnly : true, secure : true, sameSite : true, expires : 0});
    return uuid;
};
