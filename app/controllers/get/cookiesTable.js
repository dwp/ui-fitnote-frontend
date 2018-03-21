function cookiesTablePage(req, res) {
    res.render('cookies-table', {
        version : config.version,
        timeStamp : Date.now(),
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        currentPage : 'cookies-table'
    });
}

module.exports.cookiesTablePage = cookiesTablePage;
