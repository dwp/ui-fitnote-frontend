function addressPage(req, res) {
    var errorMessage;
    var houseNumberError;
    var postcodeError;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));

    if (req.query.houseNumber === '0') {
        houseNumberError = {
            message : req.i18nTranslator.t('errors:address.house-number'),
            field : 'houseNumberID'
        };
    }

    if (req.query.postcode === '0') {
        postcodeError = {
            message : req.i18nTranslator.t('errors:address.postcode'),
            field : 'postcodeID'
        };
    }

    if ((req.query.houseNumber !== '0') && (req.query.postcode !== '0')) {
        errorMessage = '';
    } else {
        errorMessage = {
            houseNumber : houseNumberError,
            postcode : postcodeError
        };
    }

    res.render('address', {
        sessionId : req.cookies.sessionId,
        version : config.version,
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        timeStamp : Date.now(),
        currentPage : 'address',
        errors : errorMessage,
        validationErrors : validationErrors
    });
}

module.exports.addressPage = addressPage;
