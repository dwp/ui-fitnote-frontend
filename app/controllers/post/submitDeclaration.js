var request = require('request');
var logger = require(appRootDirectory + '/app/functions/bunyan');
var hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');
const config = require('config');

function submitDeclaration(req, res) {
    var logType = logger.child({widget : 'confirmation'});
    var redirectUrl;
    var errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
    var fitnote = {
        sessionId : req.cookies.sessionId,
        accepted : true
    };

    var options = {
        url : config.get('api.url') + '/declaration',
        method : 'POST',
        json : true,
        timeout : 240000,
        headers : {
            'Accept' : 'application/json',
            'content-type' : 'application/json'
        },
        body : fitnote
    };

    function processRequest() {
        logType.info('Submitted form data successfully');
        res.redirect('/complete');
    }

    function handleFormError(err, errorMsg) {
        logType.fatal(errorMsg + ':' + err);
        res.status(500).render(errorUrl);
    }

    function callback(err, response, body) {
        if (!err) {
            logType.info('Response Received: ' + response.statusCode);
            switch (response.statusCode) {
            case 200:
            case 201:
                processRequest();
                break;
            case 400:
                handleFormError(body, 'Problem with submitted form data');
                break;
            default:
                handleFormError(body, 'API not responding ');
            }
        } else {
            handleFormError(err, 'API not responding ');
        }
    }

    if (typeof req.cookies.sessionId !== 'undefined') {
        request(options, callback);
    } else {
        redirectUrl = hasTimedOut.redirectTimeout('no valid session');
        res.redirect(redirectUrl);
    }
}

module.exports.submitDeclaration = submitDeclaration;
