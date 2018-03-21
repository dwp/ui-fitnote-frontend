var logger = require(appRootDirectory + '/app/functions/bunyan');

exports.hasViewedCookieMsg = function hasViewedCookieMsg(req, res) {
    var cookieLength = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
    var sameSite = true;

    res.cookie('cookies_agreed', 'yes', {
        httpOnly : true,
        secure : true,
        sameSite : sameSite,
        expires : cookieLength
    });

    logger.info('cookies_agreed created');

    return res.redirect('/' + req.query.postback);
};
