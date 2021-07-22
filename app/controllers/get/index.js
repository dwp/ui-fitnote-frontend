var newSession = require(appRootDirectory + '/app/functions/createSessionId');
var retry = require(appRootDirectory + '/app/functions/retryCookie');
const config = require('config');

function indexPage(req, res) {
    var sessionId;
    
    logger.info('Creating Session ID');
    sessionId = newSession.createSessionId(req, res);
    retry.retryCookie(req, res);

    res.render('index', {
        sessionId : sessionId,
        version : process.env.npm_package_version,
        timeStamp : Date.now(),
        environment : config.util.getEnv('NODE_ENV')
    });
}

module.exports.indexPage = indexPage;
