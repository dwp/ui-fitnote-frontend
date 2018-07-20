var request = require('request');
var logger = require(appRootDirectory + '/app/functions/bunyan');
var checkHoneypot = require(appRootDirectory + '/app/functions/honeypot');
var hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');
var checkBlank = require(appRootDirectory + '/app/functions/sanitise/isFieldBlank');
var checkMobile = require(appRootDirectory + '/app/functions/sanitise/validateMobileNumber');
var sendIt = require(appRootDirectory + '/app/controllers/post/submitDeclaration');

function sendTextMessageConfirmation(req, res) {
    var TextMessageDone;
    var redirectUrl;
    var logType = logger.child({widget : 'textMessage'});
    var mobRaw = req.body.mobileNumberField;
    var isMobBlank = checkBlank.notBlank(mobRaw);
    var validMobile =  checkMobile.mobileValidate(mobRaw);
    var textPermission = req.body.textReminder;
    var fakeLandlineRaw = req.body.landlineField;
    var passedHoneypot = checkHoneypot.honeypot(fakeLandlineRaw, 'BOT: honeypot detected a bot, Text Message Page, Landline Field');
    var fitnote = {
        sessionId : req.cookies.sessionId,
        mobileNumber : mobRaw
    };

    var options = {
        url : config.apiURL + '/mobile',
        method : 'POST',
        json : true,
        timeout : 240000,
        headers : {
            'Accept' : 'application/json',
            'content-type' : 'application/json'
        },
        body : fitnote
    };

    function handleErrors(TextMessageDoneValue) {
        TextMessageDone = TextMessageDoneValue;
        res.redirect('/text-message?text=' + TextMessageDone);
    }

    function processRequest() {
        logType.info('Submitted form data successfully');
        sendIt.submitDeclaration(req, res);
    }

    // This function is included only for a short period of investigating what users are inputting into the mobile telephone number field.
    // Added in July 2018. To be remove when investigation complete
    function logInvalidMobileChars(mobileNumber) {
        var start = mobileNumber.substring(0,1);
        var end = mobileNumber.substring(1);
        var invalidChars = start.replace(/[+ 0-9]/,'') + end.replace(/[ 0-9]/g, '');
        logType.info('Mobile number invalid chars: ' +  invalidChars);
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

    function hasTextMessagePassed() {
        if (typeof textPermission !== 'undefined') {
            if ((textPermission === 'Yes') && (isMobBlank === false)) {
                logType.info('Blank mobile number');
                return handleErrors(1);
            } else if ((textPermission === 'Yes') && !validMobile) {
                logType.info('Mobile number format');
                // The call to the logging function below is included only for a short period of investigating what users are inputting into the mobile telephone number field.
                // Added in July 2018. To be remove when investigation complete
                logInvalidMobileChars(mobRaw);
                return handleErrors(2);
            } else {
                return request(options, callback);
            }
        } else {
            return handleErrors(0);
        }
    }

    if (typeof req.cookies.sessionId !== 'undefined') {
        logType.info('Passed Honeypot ' + passedHoneypot);
        if (passedHoneypot === false) {
            logType.info('BOT detected. Doing fake send');
            res.redirect('/complete'); // don't post the request just go to the next page.
        } else {
            hasTextMessagePassed();
        }
    } else {
        redirectUrl = hasTimedOut.redirectTimeout('no valid session');
        res.redirect(redirectUrl);
    }
}

module.exports.sendTextMessageConfirmation = sendTextMessageConfirmation;
