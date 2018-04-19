var newSession = require(appRootDirectory + '/app/functions/createSessionId');
var retry = require(appRootDirectory + '/app/functions/retryCookie');

function indexPage(req, res) {
    var sessionId;
    
    logger.info('Creating Session ID');
    sessionId = newSession.createSessionId(req, res);
    retry.retryCookie(req, res);

    res.render('index', {
        sessionId : sessionId,
        version : config.version,
        timeStamp : Date.now(),
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        currentPage : 'index'
    });
}

module.exports.indexPage = indexPage;
