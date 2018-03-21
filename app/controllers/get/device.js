function devicePage(req, res) {
    var errorMessage;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));
    
    if (req.query.device === '0') {
        errorMessage = { 
            device : {
                message : req.i18nTranslator.t('errors:device.missing'),
                field : 'radioPhone'
            }
        };
    }

    res.render('device', {
        sessionId : req.cookies.sessionId,
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
