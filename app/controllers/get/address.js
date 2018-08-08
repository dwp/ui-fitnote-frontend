var request = require('request');
var logger = require(appRootDirectory + '/app/functions/bunyan');

function addressPage(req, res) {
    var logType = logger.child({widget : 'addressPage'});
    var errorMessage;
    var house = '';
    var postcode = '';
    var houseNumberError;
    var postcodeError;
    var postcodeFormatError;
    var validationErrors = JSON.stringify(require('../../locales/' + (req.language || 'en') + '/errors.json'));
    var errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
    var previousPage = (req.headers.referer) ? req.headers.referer.substring(req.headers.referer.lastIndexOf('/')) : '';
    var options = {
        url : config.apiURL + '/queryAddress',
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
                house = body.claimantAddress.houseNameOrNumber;
                postcode = body.claimantAddress.postcode;
                if (req.query.houseNumber === '0') {
                    houseNumberError = {
                        message : req.i18nTranslator.t('errors:address.house-number'),
                        field : 'houseNumberID'
                    };
                }

                if (req.query.postcode === '0') {
                    postcodeFormatError = {
                        message : req.i18nTranslator.t('errors:address.postcode-format'),
                        field : 'postcodeID'
                    };
                }

                if (req.query.postcode === '2') {
                    postcodeError = {
                        message : req.i18nTranslator.t('errors:address.postcode'),
                        field : 'postcodeID'
                    };
                }

                if ((req.query.houseNumber !== '0') && (req.query.postcode !== '0') && (req.query.postcode !== '2')) {
                    errorMessage = '';
                } else {
                    errorMessage = {
                        houseNumber : houseNumberError,
                        postcode : postcodeError,
                        postcodeFormat : postcodeFormatError
                    };
                }

                res.render('address', {
                    sessionId : req.cookies.sessionId,
                    version : config.version,
                    environment : config.nodeEnvironment,
                    viewedMessage : req.cookies.cookies_agreed,
                    timeStamp : Date.now(),
                    currentPage : 'address',
                    house : house,
                    postcode : postcode,
                    previousPage : previousPage,
                    errors : errorMessage,
                    validationErrors : validationErrors
                });
            } else {
                logType.error('Response.statusCode from /queryAddress api is ' + response.statusCode);
                res.render(errorUrl);
            }
        } else {
            logType.error(err);
            res.render(errorUrl);
        }
    }

    request(options, callback);
}

module.exports.addressPage = addressPage;
