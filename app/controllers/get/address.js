var request = require('request');
var logger = require(appRootDirectory + '/app/functions/bunyan');
var config = require('config');
const getLanguage = require(appRootDirectory + '/app/functions/getLanguage');

function addressPage(req, res) {
    var logType = logger.child({widget : 'addressPage'});
    var errorMessage;
    var house = '';
    var postcode = '';
    var houseNumberError;
    var postcodeError;
    var postcodeFormatError;
    var previousPageCYA = 0;
    var validationErrors = JSON.stringify(require('../../locales/' + getLanguage(req.language) + '/errors.json'));
    var errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
    var options = {
        url : config.get('api.url') + '/queryAddress',
        method : 'POST',
        json : true,
        timeout : 240000,
        headers : {
            'Accept' : 'application/json',
            'content-type' : 'application/json'
        },
        body : {sessionId : req.cookies.sessionId}
    };

    if (req.query.hasOwnProperty('ref')) {
        previousPageCYA = req.query.ref === 'check-your-answers' ? 1 : 0;
    }

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
                    version : process.env.npm_package_version,
                    environment : config.util.getEnv('NODE_ENV'),
                    timeStamp : Date.now(),
                    house : house,
                    postcode : postcode,
                    previousPageCYA : previousPageCYA,
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
