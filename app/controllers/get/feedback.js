function feedbackPage(req, res) {
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));
    var ratingError;
    var improvementsError;
    var nameError;
    var phoneError;
    var errorMessage;
    var previousPage;

    if (req.query.rating === '0') {
        ratingError = {
            message : req.i18nTranslator.t('errors:feedback.required'),
            field : 'vSatisfied'
        };
    }
    if (req.query.improvements === '0') {
        improvementsError = {
            message : req.i18nTranslator.t('errors:feedback.maxlength'),
            field : 'improvementsID'
        };
    }
    if (req.query.name === '0') {
        nameError = {
            message : req.i18nTranslator.t('errors:feedback.name'),
            field : 'nameID'
        };
    }
    if (req.query.phone === '0') {
        phoneError = {
            message : req.i18nTranslator.t('errors:feedback.phone'),
            field : 'phoneID'
        };
    }
    if ((req.query.rating !== '0') && (req.query.improvements !== '0') &&
        (req.query.name !== '0') && (req.query.phone !== '0')) {
        errorMessage = '';
    } else {
        errorMessage = {
            rating : ratingError,
            improvements : improvementsError,
            name : nameError,
            phone : phoneError
        };
    }

    previousPage = (req.headers.referer) ? 
        req.headers.referer.substring(req.headers.referer.lastIndexOf('/')) :
        (req.cookies.feedback) ? req.cookies.feedback : '';

    res.cookie('feedback',
        previousPage, 
        {httpOnly : true, secure : true, sameSite : true, expires : 0});
    
    res.render('feedback', {
        version : config.version,
        timeStamp : Date.now(),
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        currentPage : 'feedback',
        errors : errorMessage,
        validationErrors : validationErrors
    });
}

function thankYouPage(req, res) {
    res.render('thank-you', {
        version : config.version,
        timeStamp : Date.now(),
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        currentPage : 'thank-you',
        returnUrl : req.query.return
    });
}

module.exports.feedbackPage = feedbackPage;
module.exports.thankYouPage = thankYouPage;
