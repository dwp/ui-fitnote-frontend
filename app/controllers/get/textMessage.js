var request =  require('request');
var logger = require(appRootDirectory + '/app/functions/bunyan');

function textMessagePage(req, res) {
    var logType = logger.child({widget : 'textMessagePage'});
    var mobile;
    var errorMessage;
    var textMessageError;
    var textMessageMobileError;
    var textMessageFormatError;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));
    var errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
    var previousPage = (req.headers.referer) ? req.headers.referer.substring(req.headers.referer.lastIndexOf('/')) : '';
    var previousPageCYA = previousPage === '/check-your-answers' ? 1 : 0;
    var options = {
        url : config.apiURL + '/queryMobile',
        method : 'POST',
        json : true,
        timeout : 240000,
        headers : {
            'Accept' : 'application/json',
            'content-type' : 'application/json'
        },
        body : {sessionId : req.cookies.sessionId}
    };
    function callback(err, response, body) {
        if (!err) {
            if (response.statusCode === 200) {
                mobile = body.mobileNumber;
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
                    mobile : mobile,
                    currentPage : 'text-message',
                    previousPageCYA : previousPageCYA,
                    errors : errorMessage,
                    validationErrors : validationErrors
                });
            } else {
                logType.error('Response.statusCode from /queryMobile api is ' + response.statusCode);
                res.render(errorUrl);
            }
        } else {
            logType.error(err);
            res.render(errorUrl);
        }
    }

    request(options, callback);
}

module.exports.textMessagePage = textMessagePage;
