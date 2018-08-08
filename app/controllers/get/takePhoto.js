function takePhotoPage(req, res) {
    var errorMessage;
    var photoError;
    var route = (typeof req.cookies.route !== 'undefined') ? req.cookies.route : 
        (req.originalUrl.indexOf('upload') > -1) ? 'upload' : 'take';

    var page = `${route}-a-photo`;
    var fileError = false;
    var typeError = false;
    var minSizeError = false;
    var maxSizeError = false;

    if (req.query.error === 'serviceFailed') {
        photoError = {
            message : req.i18nTranslator.t('take-a-photo:serviceFail'),
            field : 'formData'
        };
    }

    if (req.query.type === '1' || req.query.size === '1' || req.query.size === '2') {
        fileError = true;
    }
    if (req.query.type === '1') {
        typeError = true;
    }
    if (req.query.size === '1') {
        minSizeError = true;
    }
    if (req.query.size === '2') {
        maxSizeError = true;
    }
    if (req.query.type === '1' || req.query.size === '1' || req.query.size === '2') {
        fileError = true;
        if (req.query.type === '1') {
            photoError = {
                message : req.i18nTranslator.t('errors:choose'),
                field : 'formData'
            };
        } else {
            photoError = {
                message : req.i18nTranslator.t(`${route}-a-photo:another`),
                field : 'formData'
            };
        }
    }

    if (req.query.error === 'invalidPhoto') {
        photoError =  {
            message : req.i18nTranslator.t('take-a-photo:invalid'),
            field : 'formData'
        };
    }

    if (req.query.error === 'noPhoto') {
        photoError =  {
            message : req.i18nTranslator.t('take-a-photo:missing'),
            field : 'formData'
        };
    }

    if (req.query.error === 'ocrFailed') {
        res.cookie('retry', parseInt(req.cookies.retry, 0) + 1, {httpOnly : true, secure : true, sameSite : true, expires : 0});
        photoError =  {
            retry : req.cookies.retry,
            message : req.i18nTranslator.t(`${route}-a-photo:failed-ocr`),
            field : 'formData'
        };
    }

    if ((req.query.error !== 'invalidPhoto') && (req.query.error !== 'noPhoto') && (req.query.error !== 'ocrFailed') && (req.query.error !== 'serviceFailed') && !fileError) {
        errorMessage = '';
    } else if (req.query.error === 'ocrFailed') {
        errorMessage = {
            photoOCR : photoError
        };
    } else {
        errorMessage = {
            photo : photoError
        };
    }

    res.render(page, {
        sessionId : req.cookies.sessionId,
        version : config.version,
        environment : config.nodeEnvironment,
        viewedMessage : req.cookies.cookies_agreed,
        timeStamp : Date.now(),
        currentPage : page,
        route : route,
        errors : errorMessage,
        fileError : fileError,
        typeError : typeError,
        minSizeError : minSizeError,
        maxSizeError : maxSizeError,
        serviceFail : req.query.error === 'serviceFailed',
        invalidPhoto : req.query.error === 'invalidPhoto'
    });
}

module.exports.takePhotoPage = takePhotoPage;
