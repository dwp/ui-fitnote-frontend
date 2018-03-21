var logger = require(appRootDirectory + '/app/functions/bunyan');

exports.redirectTimeout = function timeout(msg) {
    var redirectUrl;

    logger.info(msg);
    redirectUrl = '/session-timeout';
    return redirectUrl;
};
