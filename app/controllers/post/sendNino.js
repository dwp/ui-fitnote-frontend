var request = require('request');
var logger = require(appRootDirectory + '/app/functions/bunyan');
var isSanitised = require(appRootDirectory + '/app/functions/sanitise/sanitiseNino');
var checkNino = require(appRootDirectory + '/app/functions/sanitise/validateNinoStrict');
var hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');
var checkBlank = require(appRootDirectory + '/app/functions/sanitise/isFieldBlank');
var checkHoneypot = require(appRootDirectory + '/app/functions/honeypot');

function sendNino(req, res) {
    var ninoDone;
    var logType = logger.child({widget : 'sendNino'});
    var ninoRaw = req.body.ninoField;
    var isNinoBlank = checkBlank.notBlank(ninoRaw);
    var fakeEmailRaw = req.body.emailField;
    var convertedNino = isSanitised.sanitiseNino(ninoRaw);
    var passedNino =  checkNino.ninoValidateStrict(convertedNino);
    var passedHoneypot = checkHoneypot.honeypot(fakeEmailRaw, 'BOT: honeypot detected a bot, Nino Page, Email Field');
    var redirectUrl;

    var fitnote = {
        sessionId : req.cookies.sessionId,
        nino : convertedNino
    };

    var options = {
        url : config.apiURL + '/nino',
        method : 'POST',
        json : true,
        timeout : 240000,
        headers : {
            'Accept' : 'application/json',
            'content-type' : 'application/json'
        },
        body : fitnote
    };

    function handleErrors(ninoDoneValue) {
        ninoDone = ninoDoneValue;
        res.redirect('nino?nino=' + ninoDone);
    }

    function processRequest() {
        logType.info('Submitted form data successfully');
        res.redirect('/address');
    }

    function callback(err, response) {
        if (!err) {
            logType.info('Response Received: ' + response.statusCode);

            if (response.statusCode === 200 || response.statusCode === 201) {
                processRequest();
            } else {
                res.status(500).render('errors/500');
            }
        } else {
            logType.debug('Error' + err);
            res.status(500).render('errors/500');
        }
    }

    function hasNinoPassed() {
        if (isNinoBlank === false) {
            logType.info('Blank Nino');
            return handleErrors(0);
        }

        if (passedNino === false) {
            logType.info('Nino Invalid');
            return handleErrors(1);
        }
        return request(options, callback);
    }

    if (typeof req.cookies.sessionId !== 'undefined') {
        logType.info('Passed Honeypot ' + passedHoneypot);
        if (passedHoneypot === false) {
            logType.info('BOT detected. Doing fake send');
            res.redirect('/address'); // don't post the request just go to the next page.
            req.visitor.event('Honeypot', 'emailFieldID', 'Bot', {'dimension4' : 1});
        } else {
            hasNinoPassed();
        }
    } else {
        redirectUrl = hasTimedOut.redirectTimeout('no valid session');
        res.redirect(redirectUrl);
    }
}

module.exports.sendNino = sendNino;
