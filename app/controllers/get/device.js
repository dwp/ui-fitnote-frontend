var newSession = require(appRootDirectory + '/app/functions/createSessionId');
var retry = require(appRootDirectory + '/app/functions/retryCookie');

function devicePage(req, res) {
    var errorMessage;
    var sessionId;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));
    
    logger.info('Creating Session ID');
    sessionId = newSession.createSessionId(req, res);
    retry.retryCookie(req, res);

    if (req.query.device === '0') {
        errorMessage = { 
            device : {
                message : req.i18nTranslator.t('errors:device.missing'),
                field : 'radioPhone'
            }
        };
    }

    res.render('device', {
        sessionId : sessionId,
        version : config.version,
        timeStamp : Date.now(),
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        currentPage : 'device',
        errors : errorMessage,
        validationErrors : validationErrors
    });
}

module.exports.device = devicePage;
