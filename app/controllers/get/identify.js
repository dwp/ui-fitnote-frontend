var newSession = require(appRootDirectory + '/app/functions/createSessionId');
var retry = require(appRootDirectory + '/app/functions/retryCookie');
const config = require('config');

function identifyPage(req, res) {
    var sessionId;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));
    var previousPageCYA = 0;

    if (req.query.hasOwnProperty('ref')) {
        if (req.query.ref === 'invalid') {
            previousPageCYA = -1;
        }
        if (req.query.ref === 'method-obtained') {
            previousPageCYA = 1;
        }
    }
    logger.info('Creating Session ID');
    sessionId = newSession.createSessionId(req, res);
    retry.retryCookie(req, res);

    res.render('identify', {
        sessionId : sessionId,
        version : process.env.npm_package_version,
        timeStamp : Date.now(),
        previousPageCYA : previousPageCYA,
        environment : config.util.getEnv('NODE_ENV'),
        validationErrors : validationErrors
    });
}

module.exports.identify = identifyPage;
