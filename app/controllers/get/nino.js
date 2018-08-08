var request =  require('request');
var logger = require(appRootDirectory + '/app/functions/bunyan');

function ninoPage(req, res) {
    var logType = logger.child({widget : 'ninoPage'});
    var nino = '';
    var errorMessage;
    var ninoError;
    var ninoFormatError;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));
    var errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
    var previousPage = (req.headers.referer) ? req.headers.referer.substring(req.headers.referer.lastIndexOf('/')) : '';
    var route = typeof req.cookies.route !== 'undefined' ? req.cookies.route : 'take'
    var options = {
        url : config.apiURL + '/queryNino',
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
                nino = body.nino;
                if (req.query.nino === '0') {
                    ninoError = {
                        message : req.i18nTranslator.t('errors:nino.nino'),
                        field : 'ninoFieldID'
                    };
                }

                if (req.query.nino === '1') {
                    ninoFormatError = {
                        message : req.i18nTranslator.t('errors:nino.nino-format'),
                        field : 'ninoFieldID'
                    };
                }

                if ((req.query.nino === '0') || (req.query.nino === '1')) {
                    errorMessage = {
                        nino : ninoError,
                        ninoFormat : ninoFormatError
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
                    previousPage : previousPage,
                    route : route,
                    nino : nino,
                    errors : errorMessage,
                    validationErrors : validationErrors
                });
            } else {
                logType.error('Response.statusCode from /queryNino api is ' + response.statusCode);
                res.render(errorUrl);
            }
        } else {
            logType.error(err);
            res.render(errorUrl);
        }
    }

    request(options, callback);
}

module.exports.ninoPage = ninoPage;
