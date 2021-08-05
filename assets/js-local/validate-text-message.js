// TODO: this needs to be removed or refactored,
// conditional radios should be handeled via govuk-frontend classes instead.
var flag = false;
var invalidCharsMessage;

function focusOnTextBox() {
    setTimeout(() => {
        document.getElementById('mobileNumberID').focus()
    }, 3500)
}

(function onLoady() {
    function showMobile() {
        var radioValueRaw = document.querySelector('input[name="textReminder"]:checked');
        var radioValue;
        if (radioValueRaw !== null) {
            radioValue = radioValueRaw.value;
            if (radioValue === 'Yes') {
                document.getElementById('mobileNumberPanel').classList.remove('govuk-radios__conditional--hidden');
                document.getElementById('yesLabel').className = 'govuk-label govuk-radios__label selection-button-radio selected';
                document.getElementById('noLabel').className = 'govuk-label govuk-radios__label  selection-button-radio';
                focusOnTextBox()
            } else {
                document.getElementById('mobileNumberPanel').classList.add('govuk-radios__conditional--hidden');
                document.getElementById('noLabel').className = 'govuk-label govuk-radios__label selection-button-radio selected';
                document.getElementById('yesLabel').className = 'govuk-label govuk-radios__label selection-button-radio';
            }
        }
    }
    document.getElementById('radioYes').addEventListener('click', showMobile, false);
    document.getElementById('radioNo').addEventListener('click', showMobile, false);
})();

if (document.getElementById('radioYes').hasAttribute('checked')) {
    document.getElementById('mobileNumberPanel').classList.remove('govuk-radios__conditional--hidden');
}

function showErrorFields(field, message) {
    field.setAttribute('aria-hidden', false);
    field.innerHTML = '<span class="govuk-visually-hidden">Error:</span>' + message;
}

function mobileNumberValid(mobileNumber) {
    var regex = /^\+?[ 0-9]{11,20}$/;
    return regex.test(mobileNumber);
}

function logInvalidMobileCharsToGA(mobileNumber) {
    var start = mobileNumber.substring(0, 1);
    var end = mobileNumber.substring(1);
    var invalidChars = start.replace(/[+ 0-9]/, '') + end.replace(/[ 0-9]/g, '');
    invalidCharsMessage = ('Mobile number invalid chars: ' + invalidChars);
    return invalidCharsMessage;
}

function getErrorSummary(msg, field) {
    return '<li>' +
        '<a href="#' + field + '">' + msg + '</a>' +
        '</li>'
}

function addErrorClass(id, className) {
    var element = document.getElementById(id);
    element.classList.add(className);
}

function checkMobileNumber() {
    var radioValueRaw = document.querySelector('input[name="textReminder"]:checked');
    var mobileNumberID = document.getElementById('mobileNumberID');
    var errorMessageMobileNumberID = document.getElementById('error-message-text-messageFieldID');
    var errorMessageRadioID = document.getElementById('error-message-radio');

    document.getElementById('govuk-error-summary').setAttribute('aria-hidden', true);
    errorMessageRadioID.setAttribute('aria-hidden', true);
    document.getElementById('govuk-form-group-error').classList.remove('govuk-form-group--error');
    document.getElementById('mobileNumberPanel').classList.remove('border-none');

    if (!radioValueRaw) {
        document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary['text-message'].missing, 'radioYes');
        showErrorFields(errorMessageRadioID, errorDictionary['text-message'].missing);
        addErrorClass('govuk-form-group-error', 'govuk-form-group--error')
        document.getElementById("govuk-error-summary").focus();
        flag = false;
        return;
    }

    if (radioValueRaw.value === 'Yes') {
        if (mobileNumberID.value === '') {
            document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
            document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary['text-message'].mobile, 'mobileNumberID');
            showErrorFields(errorMessageMobileNumberID, errorDictionary['text-message'].mobile);
            document.getElementById('mobileNumberPanel').classList.add('border-none');
            addErrorClass('mobile-form', 'govuk-form-group--error')
            addErrorClass('mobileNumberID', 'govuk-input--error')
            document.getElementById("govuk-error-summary").focus();
            flag = false;
            return;
        }

        if (!mobileNumberValid(mobileNumberID.value)) {
            document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
            document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary['text-message'].format, 'mobileNumberID');
            showErrorFields(errorMessageMobileNumberID, errorDictionary['text-message'].format);
            document.getElementById('mobileNumberPanel').classList.add('border-none');
            addErrorClass('mobile-form', 'govuk-form-group--error')
            addErrorClass('mobileNumberID', 'govuk-input--error')
            logInvalidMobileCharsToGA(mobileNumberID.value);
            document.getElementById("govuk-error-summary").focus();
            flag = false;
            return;
        }
    }
    flag = true;
}

function submitForm() {
    checkMobileNumber();
    return flag;
}
