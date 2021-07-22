const rp = require('request-promise-native');
const multer = require('multer');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const encoder = require(appRootDirectory + '/app/functions/base64Encode');
const checkHoneypot = require(appRootDirectory + '/app/functions/honeypot');
const hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');
const sessionExpiry = require(appRootDirectory + '/app/functions/refreshSessionExpiryTime.js');
const config = require('config');

function sendPhoto(req, res) {
    const logType = logger.child({widget : 'photoUploader'});

    const storage = multer.memoryStorage();
    const upload = multer({storage : storage}).single('userPhoto');
    const route = typeof req.cookies.route !== 'undefined' ? req.cookies.route : '';

    function encodeImage() {
        if (typeof req.file !== 'undefined') {
            return encoder.convertBase64(req.file.buffer);
        } else {
            return '';
        }
    }

    function handleCriticalFormError(err, msg) {
        logType.fatal({err : err}, msg);
        return res.status(500).render('errors/500');
    }

    function uploadCallback(err) {
        const file = req.file;
        if (!file) {
            logType.debug({err : err}, 'No photo submitted');
            res.redirect(`/${route}?error=noPhoto`);
            return;
        }

        if (err) {
            res.render(`${route}`, {error : {message : req.i18nTranslator.t(`${route}:connection`)}});
            logType.error({err : err}, 'Problem uploading image');
            return;
        } else if (typeof req.cookies.sessionId !== 'undefined') {
            const fakeImageNameRaw = req.body.imageNameField;
            const passedHoneypot = checkHoneypot.honeypot(fakeImageNameRaw, 'BOT: honeypot detected a bot, Take a Photo Page, ImageName Field');
            logType.info('Passed Honeypot ' + passedHoneypot);

            if (!passedHoneypot) {
                logType.info('BOT detected. Doing fake send');
                res.redirect('/nino'); // don't post the request just go to the next page.
            } else {
                if (typeof req.file !== 'undefined') {
                    logType.info('File type is ' + req.file.mimetype);
                    logType.info('File size is ' + req.file.size);
                    const validImageFileTypes = new RegExp('^image/');
                    if ((!validImageFileTypes.test(req.file.mimetype)) && req.file.mimetype !== 'application/pdf') {
                        logType.info('File type (' + req.file.mimetype + ') is invalid');
                        res.redirect(`/${route}?type=1`);
                        return;
                    } else if (req.file.mimetype === 'image/heic' || req.file.mimetype === 'image/heif') {
                        logType.info('File type (' + req.file.mimetype + ') is invalid as it is heic or heif');
                        res.redirect(`/${route}?type=2`);
                        return;
                    }

                    if ((req.file.size > config.get('service.maxFileSize'))) {
                        logType.info('File size (' + req.file.size + ') is invalid');
                        if (req.file.size > config.get('service.maxFileSize')) {
                            res.redirect(`/${route}?size=2`);
                        }
                        return;
                    }
                }
                const userPhotoEncoded = encodeImage();
                logType.info('Image Encoded');
                logType.info('Starting image upload');

                const uploadOptions = {
                    url : config.get('api.url') + '/photo',
                    method : 'POST',
                    json : true,
                    headers : {
                        'Accept' : 'application/json',
                        'content-type' : 'application/json'
                    },
                    agentOptions : {
                        keepAlive : true
                    },
                    timeout : 240000,
                    body : {
                        sessionId : req.cookies.sessionId,
                        image : userPhotoEncoded
                    }
                };

                rp(uploadOptions)
                    .then(() => {
                        sessionExpiry.refreshTime(res, logType);
                        const imgStatusOptions = {
                            url : config.get('api.url') + '/imagestatus?sessionId=' + req.cookies.sessionId,
                            method : 'GET',
                            json : true
                        };
                        // infinite request to image status api call until fitnoteStatus is updated 
                        function requestRetry(options) {
                            // Return a request
                            return rp(options).then((imgResponse) => {
                                const {fitnoteStatus} = imgResponse;
                                // check if successful. If so, return the response transformed to json
                                if (fitnoteStatus === 'UPLOADED') {
                                    // return a call to requestRetry
                                    return requestRetry(options);
                                } else {
                                    logType.info('body ' + fitnoteStatus);
                                    if (config.nodeEnvironment !== 'test') {
                                        switch (fitnoteStatus) {
                                        case 'SUCCEEDED':
                                            return res.redirect('/nino');
                                        case 'FAILED_IMG_OCR':
                                        case 'FAILED_IMG_OCR_PARTIAL':
                                            return res.redirect(`/${route}?error=ocrFailed`);
                                        case 'FAILED_IMG_SIZE':
                                            return res.redirect('/422');
                                        case 'FAILED_ERROR':
                                            return res.redirect(`/${route}?error=invalidPhoto`);
                                        default:
                                            return res.redirect(`/${route}`);
                                        }
                                    } else {
                                        return res.redirect(`/${route}`);
                                    }
                                }
                            })
                                .catch((imgErr) => {
                                    logType.error('Error from imageStatus api call is : ', imgErr);
                                    res.redirect(`/${route}?error=serviceFailed`);
                                });
                        }

                        requestRetry(imgStatusOptions);
                    })
                    .catch(() => {
                        handleCriticalFormError(err, 'API not responding');
                    });
            }
        } else {
            const redirectUrl = hasTimedOut.redirectTimeout('no valid session');
            res.redirect(redirectUrl);
        }
    }

    upload(req, res, uploadCallback);
}

module.exports.sendPhoto = sendPhoto;
