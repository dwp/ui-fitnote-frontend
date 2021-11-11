var convertedNino;
var passedNino;
var checkNinoField;
var flag = false;

function sanitiseNino(nino) {
    return nino.toUpperCase().replace(/[\s|\-]/g, '');
}

function ninoValidateStrict(nino) {
    var regex = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/;
    return regex.test(nino);
}

function isInputEmpty(inputField) {
    if ((inputField.value === '') || (inputField.value === 'null')) {
        return false;
    }
    return true;
}

function showErrorFields(field, message) {
    field.setAttribute('aria-hidden', false);
    field.innerHTML = '<span class="govuk-visually-hidden">Error:</span>' + message;
}

function getErrorSummary(msg) {
    return '<li>' +
        '<a href="#ninoFieldID"">' + msg + '</a>' +
        '</li>'
}

function addErrorClass(id, className) {
    var element = document.getElementById(id);
    element.classList.add(className);
}

function checkNino() {
    var ninoFieldID = document.getElementById('ninoFieldID');
    var errorMessageNinoFieldID = document.getElementById('error-message-ninoFieldID');

    checkNinoField = isInputEmpty(ninoFieldID);

    if (checkNinoField === true) {
        convertedNino = sanitiseNino(ninoFieldID.value);
        passedNino =  ninoValidateStrict(convertedNino);

        if (passedNino === true) {
            flag = true;
        } else {
            document.title =  errorPageTitle;
            document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
            document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary.nino['nino-format']);
            showErrorFields(errorMessageNinoFieldID, errorDictionary.nino['nino-format']);
            addErrorClass('govuk-form-group-error', 'govuk-form-group--error')
            addErrorClass('ninoFieldID', 'form-control--error')
            document.getElementById("govuk-error-summary").focus();
            flag = false;
        }
    } 
    else {
        document.title =  errorPageTitle;
        document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary.nino.nino);
        showErrorFields(errorMessageNinoFieldID, errorDictionary.nino.nino);
        addErrorClass('govuk-form-group-error', 'govuk-form-group--error')
        addErrorClass('ninoFieldID', 'form-control--error')
        document.getElementById("govuk-error-summary").focus();
        flag = false;
    }
}


function submitForm() {
    checkNino();
    return flag;
}
