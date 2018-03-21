var logger = require(appRootDirectory + '/app/functions/bunyan');

exports.honeypot = function honeypot(field, message) {
    if (field) {
        logger.info(message);
        return false;
    }
    return true;
};
