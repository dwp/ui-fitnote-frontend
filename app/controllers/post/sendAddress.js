var request = require('request');
var logger = require(appRootDirectory + '/app/functions/bunyan');
var isSanitised = require(appRootDirectory + '/app/functions/sanitise/sanitiseField');
var hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');
var checkBlank = require(appRootDirectory + '/app/functions/sanitise/isFieldBlank');
var checkHoneypot = require(appRootDirectory + '/app/functions/honeypot');
var validatePostcode = require(appRootDirectory + '/app/functions/sanitise/validatePostcode');
const sessionExpiry = require(appRootDirectory + '/app/functions/refreshSessionExpiryTime.js');
const config = require('config');

function sendAddress(req, res) {
    var houseNumberValid;
    var formValid;
    var redirectUrl;
    var logType = logger.child({widget : 'postAddress'});
    var houseNumberRaw = req.body.houseNumberField;
    var postcodeRaw = req.body.postcodeField;
    var postcodeSanitised = isSanitised.sanitiseField(postcodeRaw);
    var postcodeValid = validatePostcode.validatePostcode(postcodeSanitised.toUpperCase());
    var fakeCountyRaw = req.body.countyField;
    var previousPageCYA = req.body.previousPage;
    var errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
    var passedHoneypot = checkHoneypot.honeypot(fakeCountyRaw, 'BOT: honeypot detected a bot, Address Page, County Field');
    var ishouseNumberBlank = checkBlank.notBlank(houseNumberRaw);
    var fitnote = {
        sessionId : req.cookies.sessionId,
        houseNameOrNumber : houseNumberRaw.trim(),
        postcode : postcodeRaw.trim()
    };

    var options = {
        url : config.get('api.url') + '/address',
        method : 'POST',
        json : true,
        timeout : 240000,
        headers : {
            'Accept' : 'application/json',
            'content-type' : 'application/json'
        },
        body : fitnote
    };

    function validateHouseNumber() {
        if (ishouseNumberBlank === false) {
            houseNumberValid = 0;
        } else {
            houseNumberValid = 1;
        }
    }

    function validateForm() {
        if ((houseNumberValid === 1) && (postcodeValid === 1)) {
            formValid = true;
        } else {
            formValid = false;
        }
    }

    function processRequest() {
        logType.info('Submitted form data successfully');
        if (previousPageCYA === '1') {
            res.redirect('/check-your-answers');
        } else {
            res.redirect('/text-message');
        }
    }

    function handleFormError() {
        logType.info('Form Fields Invalid');
        res.redirect('address?houseNumber=0&postcode=0');
    }

    function callback(err, response) {
        sessionExpiry.refreshTime(res, logType);
        if (!err) {
            logType.info('Response Received: ' + response.statusCode);
            switch (response.statusCode) {
            case 200:
            case 201:
                processRequest();
                break;
            default:
                handleFormError();
            }
        } else {
            logType.debug('Error' + err);
            res.status(500).render(errorUrl);
        }
    }

    validateHouseNumber();
    validateForm();

    if (typeof req.cookies.sessionId !== 'undefined') {
        logger.info('Passed Honeypot ' + passedHoneypot);

        if (passedHoneypot === false) {
            logType.info('BOT detected. Doing fake send');
            res.redirect('/text-message'); // don't post the request just go to the next page.
        } else if (passedHoneypot === true && formValid === true) {
            request(options, callback);
        } else {
            logType.info('Form Fields Invalid');
            res.redirect('address?houseNumber=' + houseNumberValid + '&postcode=' + postcodeValid);
        }
    } else {
        redirectUrl = hasTimedOut.redirectTimeout('no valid session');
        res.redirect(redirectUrl);
    }
}

module.exports.sendAddress = sendAddress;
