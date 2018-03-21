exports.retryCookie = function retryCookie(req, res) {
    logger.info('retry cookie generated');
    res.cookie('retry', '1', {httpOnly : true, secure : true, sameSite : true, expires : 0});
    return true;
};
