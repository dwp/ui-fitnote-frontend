/* eslint-disable complexity */
function takePhotoPage(req, res) {
    const config = require('config');

    let errorMessage;
    let photoError;
    let route;

    if (typeof req.cookies.route !== 'undefined') {
        route = req.cookies.route;
    }

    const page = route;
    let fileError = false;
    let typeError = false;
    let maxSizeError = false;

    if (req.query.error === 'serviceFailed') {
        photoError = {
            message : req.i18nTranslator.t(`${route}:serviceFail`),
            field : 'userPhotoID'
        };
    }

    if (req.query.type === '1' || req.query.size === '1' || req.query.size === '2') {
        fileError = true;
    }
    if (req.query.type === '1') {
        typeError = true;
    }
    if (req.query.type === '2') {
        typeError = true;
    }
    if (req.query.size === '2') {
        maxSizeError = true;
    }
    if (req.query.type === '1' || req.query.type === '2' || req.query.size === '1' || req.query.size === '2') {
        fileError = true;
        if (req.query.type === '1') {
            photoError = {
                message : req.i18nTranslator.t('errors:choose'),
                field : 'userPhotoID'
            };
        } else if (req.query.type === '2') {
            photoError = {
                message : req.i18nTranslator.t('errors:heicf'),
                field : 'userPhotoID'
            };
        } else {
            photoError = {
                message : req.i18nTranslator.t(`${route}:tooBig`),
                field : 'userPhotoID'
            };
        }
    }

    if (req.query.error === 'invalidPhoto') {
        photoError = {
            message : req.i18nTranslator.t(`${route}:invalid`),
            field : 'userPhotoID'
        };
    }

    if (req.query.error === 'noPhoto') {
        photoError = {
            message : req.i18nTranslator.t(`${route}:missing`),
            field : 'userPhotoID'
        };
    }

    if (req.query.error === 'ocrFailed') {
        const int = parseInt(req.cookies.retry, 0) + 1;
        res.cookie('retry', int, {
            httpOnly : true,
            secure : config.get('cookieOptions.secure') === 'true',
            sameSite : true,
            expires : 0
        });
        photoError = {
            retry : req.cookies.retry,
            message : req.i18nTranslator.t(`${route}:failed-ocr`),
            field : 'userPhotoID'
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
        version : process.env.npm_package_version,
        environment : config.util.getEnv('NODE_ENV'),
        timeStamp : Date.now(),
        route : route,
        errors : errorMessage,
        fileError : fileError,
        typeError : typeError,
        maxSizeError : maxSizeError,
        serviceFail : req.query.error === 'serviceFailed',
        invalidPhoto : req.query.error === 'invalidPhoto'
    });
}

module.exports.takePhotoPage = takePhotoPage;
