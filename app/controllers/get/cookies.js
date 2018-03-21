function cookiesPage(req, res) {
    res.render('cookies', {
        version : config.version,
        timeStamp : Date.now(),
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        currentPage : 'cookies'
    });
}

module.exports.cookiesPage = cookiesPage;
