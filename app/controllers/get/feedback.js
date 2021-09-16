const config = require('config');
const getLanguage = require(appRootDirectory + '/app/functions/getLanguage');

function feedbackPage(req, res) {
    var validationErrors = JSON.stringify(require('../../locales/' + getLanguage(req.language) + '/errors.json'));
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

    if (req.headers.referer) {
        previousPage = req.headers.referer.substring(req.headers.referer.lastIndexOf('/'));
    } else if (req.cookies.feedback) {
        previousPage = req.cookies.feedback;
    } else {
        previousPage = '';
    }

    res.cookie('feedback',
        previousPage, 
        {httpOnly : true, secure : config.get('cookieOptions.secure'), sameSite : true, expires : 0});
    
    res.render('feedback', {
        version : process.env.npm_package_version,
        timeStamp : Date.now(),
        environment : config.util.getEnv('NODE_ENV'),
        errors : errorMessage,
        validationErrors : validationErrors
    });
}

function thankYouPage(req, res) {
    res.render('thank-you', {
        version : process.env.npm_package_version,
        timeStamp : Date.now(),
        environment : config.util.getEnv('NODE_ENV'),
        returnUrl : req.query.return
    });
}

module.exports.feedbackPage = feedbackPage;
module.exports.thankYouPage = thankYouPage;
