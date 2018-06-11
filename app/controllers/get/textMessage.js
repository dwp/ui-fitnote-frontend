function textMessagePage(req, res) {
    var errorMessage;
    var textMessageError;
    var textMessageMobileError;
    var textMessageFormatError;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));

    if (req.query.text === '0') {
        textMessageError = {
            message :  req.i18nTranslator.t('errors:text-message.missing'),
            field : 'mobileNumberID'
        };
    }

    if (req.query.text === '1') {
        textMessageMobileError = {
            message : req.i18nTranslator.t('errors:text-message.mobile'),
            field : 'mobileNumberID'
        };
    }

    if (req.query.text === '2') {
        textMessageFormatError = {
            message :  req.i18nTranslator.t('errors:text-message.format'),
            field : 'mobileNumberID'
        };
    }

    if (req.query.text === '0') {
        errorMessage = {
            radioMessage : textMessageError
        };
    } else if ((req.query.text === '1') || (req.query.text === '2')) {
        errorMessage = {
            textMessageMobile : textMessageMobileError,
            textMessageFormat : textMessageFormatError
        };
    } else {
        errorMessage = '';
    }

    res.render('text-message', {
        sessionId : req.cookies.sessionId,
        version : config.version,
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        timeStamp : Date.now(),
        currentPage : 'text-message',
        errors : errorMessage,
        validationErrors : validationErrors
    });
}

module.exports.textMessagePage = textMessagePage;
