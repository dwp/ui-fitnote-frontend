var ga;
var gaOutcome;
var flag = false;
var invalidCharsMessage;

(function onLoady() {
    function showMobile() {
        var radioValueRaw = document.querySelector('input[name="textReminder"]:checked');
        var radioValue;

        if (radioValueRaw !== null) {
            radioValue = radioValueRaw.value;
            if (radioValue === 'Yes') {
                document.getElementById('mobileNumberPanel').setAttribute('aria-hidden', false);
                document.getElementById('yesLabel').className = 'block-label selection-button-radio selected';
                document.getElementById('noLabel').className = 'block-label selection-button-radio';
            } else {
                document.getElementById('mobileNumberPanel').setAttribute('aria-hidden', true);
                document.getElementById('noLabel').className = 'block-label selection-button-radio selected';
                document.getElementById('yesLabel').className = 'block-label selection-button-radio';
            }
        }
        ga('send', 'event', 'Radio - click', 'Do you want a text message to confirm your fit note has been received?', radioValue + ' - textReminder', {'dimension5' : radioValue + ' - textReminder'});
    }
    document.getElementById('radioYes').addEventListener('click', showMobile, false);
    document.getElementById('radioNo').addEventListener('click', showMobile, false);
})();

if (!document.getElementById('radioYes').hasAttribute('checked')) {
    document.getElementById('mobileNumberPanel').setAttribute('aria-hidden', true);
}

function showErrorFields(field, message) {
    field.setAttribute('aria-hidden', false);
    field.innerHTML = message;
    field.parentElement.className = 'form-group error';
}

function showRadioErrorFields(field) {
    field.setAttribute('aria-hidden', false);
    field.parentElement.parentElement.parentElement.className = 'form-group error';
}

function mobileNumberValid(mobileNumber) {
    var regex = /^\+?[ 0-9]{11,20}$/;
    return regex.test(mobileNumber);
}

function logInvalidMobileCharsToGA(mobileNumber) {
    var start = mobileNumber.substring(0,1);
    var end = mobileNumber.substring(1);
    var invalidChars = start.replace(/[+ 0-9]/,'') + end.replace(/[ 0-9]/g, '');
    invalidCharsMessage = ('Mobile number invalid chars: ' +  invalidChars);
    return invalidCharsMessage;
}

function getErrorSummary(msg, field){
    return '<h2 class="bold-medium" id="error-summary-heading">' + errorDictionary['error-summary-h2'] + '</h2><p>'+ errorDictionary['error-summary-p'] +'</p><div id="error-summary-list-id"><ul class="error-summary-list"><li class="ls-none"><a href="#'+ field +'" id="error-field-mobileFieldID" data-related="mobile" class="bold small gds-red">'+ msg+'</a></li></ul></div>'
}

function checkMobileNumber() {
    var radioValueRaw = document.querySelector('input[name="textReminder"]:checked');
    var mobileNumberID = document.getElementById('mobileNumberID');
    var errorMessageMobileNumberID = document.getElementById('error-message-text-messageFieldID');
    var errorMessageRadioID = document.getElementById('error-message-radio');
    
    document.getElementById('error-summary').setAttribute('aria-hidden', true);
    errorMessageRadioID.setAttribute('aria-hidden', true);
    errorMessageRadioID.parentElement.parentElement.parentElement.className = 'form-group';

    if (!radioValueRaw) {
        document.getElementById('error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary').innerHTML = getErrorSummary(errorDictionary['text-message'].missing, 'radioYes');
        showRadioErrorFields(errorMessageRadioID);
        flag = false;
        gaOutcome = 2;
        return;
    }

    if (radioValueRaw.value === 'Yes') {
        if(mobileNumberID.value === '') {
            document.getElementById('error-summary').setAttribute('aria-hidden', false);
            document.getElementById('error-summary').innerHTML = getErrorSummary(errorDictionary['text-message'].mobile, 'mobileNumberID');
            showErrorFields(errorMessageMobileNumberID, errorDictionary['text-message'].mobile);
            flag = false;
            gaOutcome = 1;
            return;
        }

        if(!mobileNumberValid(mobileNumberID.value)) {
            document.getElementById('error-summary').setAttribute('aria-hidden', false);
            document.getElementById('error-summary').innerHTML = getErrorSummary(errorDictionary['text-message'].format, 'mobileNumberID');
            showErrorFields(errorMessageMobileNumberID, errorDictionary['text-message'].format);
            logInvalidMobileCharsToGA(mobileNumberID.value);
            flag = false;
            gaOutcome = 3;
            return;
        }
    }
    flag = true;
}

function sendGa(gaValue) {
    switch (gaValue) {
    case 1 :
        ga('send', 'event', 'Error - validation', 'mobileNumberID', 'Enter your mobile number');
        break;
    case 2 :
        ga('send', 'event', 'Error - validation', 'mobileNumberID', 'Select Yes or No');
        break;
    case 3 :
        ga('send', 'event', 'Error - validation', 'mobileNumberID', 'Check mobile phone number format');
        ga('send', 'event', 'Error - validation', 'mobileNumberID', invalidCharsMessage);
        break;
    default:
        ga('send', 'event', 'Error - validation', 'mobileNumberID', 'unknown error');
    }
}

function submitForm() {
    checkMobileNumber();
    if (flag === false) {
        sendGa(gaOutcome);
    }
    return flag;
}
