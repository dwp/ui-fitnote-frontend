function ninoPage(req, res) {
    var errorMessage;
    var ninoError;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));

    if (req.query.nino === '0') {
        ninoError = {
            message : req.i18nTranslator.t('errors:nino.nino'),
            field : 'ninoFieldID'
        };
    }

    if (req.query.nino === '1') {
        ninoError = {
            message : req.i18nTranslator.t('errors:nino.nino-format'),
            field : 'ninoFieldID'
        };
    }

    if ((req.query.nino === '0') || (req.query.nino === '1')) {
        errorMessage = {
            nino : ninoError
        };
    } else {
        errorMessage = '';
    }

    res.render('nino', {
        sessionId : req.cookies.sessionId,
        version : config.version,
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        timeStamp : Date.now(),
        currentPage : 'nino',
        errors : errorMessage,
        validationErrors : validationErrors
    });
}

module.exports.ninoPage = ninoPage;
