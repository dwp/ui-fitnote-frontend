function sessionTimeout(req, res) {
    res.render('errors/session-timeout', {
        version : config.version,
        timeStamp : Date.now(),
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        sessionId : req.cookies.sessionId,
        currentPage : 'session-timeout'
    });

    // Make sure the cookies are cleared AFTER page render, so GA can get values, but cleared for security
    res.clearCookie('sessionId');
    res.clearCookie('retry');
}
module.exports.sessionTimeout = sessionTimeout;
