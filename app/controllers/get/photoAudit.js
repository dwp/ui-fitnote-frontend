var request = require('request');

// POSSIBLE API RESPONSES
/*
UPLOADED, - image uploaded
CHECKING, - image being checked for OCR...
FAILED_IMG_SIZE, The image is in portrait not landscape (currently OFF)
PASS_IMG_SIZE,  The image is in landscape
FAILED_IMG_OCR,  The image  could not be read by OCR
PASS_IMG_OCR, The image passed OCR check.
SUCCEEDED, The image has passed all tests
FAILED_ERROR The image was unable to be read. E.G. another file with an extension changed to a .jpg and uploaded.

The function needs to check QR then redirect if error.
If QR passes, then check OCR on Photo.
If fail redirect to photo.
If pass, redirect to next step.

We don't need to check for QR pass, since it is assumed if OCR check has begun.
*/

function photoAuditPage(req, res) {
    var logType = logger.child({widget : 'imageWaiting'});
    var imageStatusTemp; //var should be local to the function, its a temp.
    var options;
    var route = typeof req.cookies.route !== 'undefined' ? req.cookies.route : 'take';

    function callback(error, response) {
        if (error || response.statusCode !== 200) {
            if (error) {
                logType.error('Error from imageStatus api call is : ', error);
            } else {
                logType.error('Response status code from imageStatus api call: ' + response.statusCode);
            }
            imageStatusTemp = 'service-fail';
        } else {
            logType.info('body ' + response.body.fitnoteStatus);
            if (config.nodeEnvironment !== 'test') {
                switch (response.body.fitnoteStatus) {
                    case 'SUCCEEDED' :
                        imageStatusTemp = 'success';
                        break;
                    case 'FAILED_IMG_OCR':
                    case 'FAILED_IMG_OCR_PARTIAL':
                        imageStatusTemp = 'photo-fail-ocr';
                        break;
                    case 'FAILED_IMG_SIZE':
                        imageStatusTemp = 'photo-fail-size';
                        break;
                    case 'FAILED_ERROR':
                        imageStatusTemp = 'photo-fail';
                        break;
                    default:
                        imageStatusTemp = 'checking';
                }
            } else {
                imageStatusTemp = 'checking';
            }

        }

        //render has to be in the request. The Nunjucks tag is dependant on the result.
        res.render('photo-audit', {
            sessionId: req.cookies.sessionId,
            version: config.version,
            imageStatus: imageStatusTemp,
            timeStamp: Date.now(),
            environment: config.nodeEnvironment,
            viewedMessage: req.cookies.cookies_agreed,
            currentPage: 'photo-audit',
            route: route
        });
    }

    options = {
        url : config.apiURL + '/imagestatus?sessionId=' + req.cookies.sessionId,
        method : 'GET',
        json : true
    };

    //So long as we aren't in test mode, do the image check.
    logType.info('Checking OCR..');
    request(options, callback);

    imageStatusTemp = ''; // we need to clear down the variable after each request so it isn't persisted for the session.
}

module.exports.photoAuditPage = photoAuditPage;
