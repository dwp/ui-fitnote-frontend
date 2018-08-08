var request = require('request');
var logger = require(appRootDirectory + '/app/functions/bunyan');
var isSanitised = require(appRootDirectory + '/app/functions/sanitise/sanitiseField');
var hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');
var checkBlank = require(appRootDirectory + '/app/functions/sanitise/isFieldBlank');
var checkHoneypot = require(appRootDirectory + '/app/functions/honeypot');
var validatePostcode = require(appRootDirectory + '/app/functions/sanitise/validatePostcode');

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
    var houseNumberSanitised = isSanitised.sanitiseField(houseNumberRaw);
    var previousPage = req.body.previousPage;
    var errorUrl = req.cookies.lang === 'cy' ? 'errors/500-cy' : 'errors/500';
    var passedHoneypot = checkHoneypot.honeypot(fakeCountyRaw, 'BOT: honeypot detected a bot, Address Page, County Field');
    var ishouseNumberBlank = checkBlank.notBlank(houseNumberSanitised);
    var fitnote = {
        sessionId : req.cookies.sessionId,
        houseNameOrNumber : houseNumberSanitised,
        postcode : postcodeSanitised
    };

    var options = {
        url : config.apiURL + '/address',
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
        if (previousPage === '/check-your-answers') {
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
            req.visitor.event('Honeypot', 'countyID', 'Bot', {'dimension4' : 1});
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
