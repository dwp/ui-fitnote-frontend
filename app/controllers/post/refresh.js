var logger = require(appRootDirectory + '/app/functions/bunyan');

function refresh(req, res) {
    var page = req.body.page;
    var expires = new Date(Date.now() + (30 * 60 * 1000));
    logger.info('Session timeout refreshed');
    res.cookie('exp', expires.toUTCString(), {httpOnly : true, secure : true, sameSite : true, expires : 0});
    res.redirect('/' + page);  
}

module.exports.refresh = refresh;
