var checkHouseNumber;
var checkPostCode;
var checkPostCodeFormat;
var flag = false;
var errorMessageHouseNumberID = document.getElementById('error-message-houseNumberID');
var errorMessagePostcodeNumberID = document.getElementById('error-message-postcodeID');
var houseNumberID = document.getElementById('houseNumberID');
var postcodeID = document.getElementById('postcodeID');
var errorSummaryHouse = '<li><a href="#houseNumberID">' + errorDictionary.address['house-number'] + '</a></li>';
var errorSummaryPostcode = '<li><a href="#postcodeID">' + errorDictionary.address.postcode + '</a></li>';
var errorSummaryPostcodeFormat = '<li><a href="#postcodeID">' + errorDictionary.address['postcode-format'] + '</a></li>';
var errorSummaryLi;

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

function hideErrorFields(field) {
    field.setAttribute('aria-hidden', true);
}


function getErrorSummary(li) {
    return li
}

function isValidPostcode(postcode) {
    var regex = /^(?![QVX])[A-Z]((?![IJZ])[A-Z][0-9]([0-9]?|[ABEHMNPRVWXY]?)|[0-9]([0-9]?|[ABCDEFGHJKPSTUW]?))[0-9](?![CIKMOV])[A-Z]{2}$/;
    return regex.test(postcode.toUpperCase().replace(/[\s|\-]/g, ''));
}

function addErrorClass(id, className) {
    var element = document.getElementById(id);
    element.classList.add(className);
}

function checkAddress() {
    checkHouseNumber = isInputEmpty(houseNumberID);
    checkPostCode = isInputEmpty(postcodeID);
    checkPostCodeFormat = isValidPostcode(postcodeID.value);

    flag = checkHouseNumber && checkPostCode && checkPostCodeFormat;

    if (!flag) {
        hideErrorFields(errorMessagePostcodeNumberID);
        hideErrorFields(errorMessageHouseNumberID);
        errorSummaryLi = '';
        document.getElementById('houseNumberID').classList.remove('govuk-input--error');
        document.getElementById('postcodeID').classList.remove('govuk-input--error');
        document.getElementById('govuk-form-group-error-house').classList.remove('govuk-form-group--error');
        document.getElementById('govuk-form-group-error-postcode').classList.remove('govuk-form-group--error');

        if (!checkHouseNumber) {
            errorSummaryLi += errorSummaryHouse;
            showErrorFields(errorMessageHouseNumberID, errorDictionary.address['house-number']);
            addErrorClass('govuk-form-group-error-house', 'govuk-form-group--error')
            addErrorClass('houseNumberID', 'govuk-input--error')
        }

        if (!checkPostCode) {
            errorSummaryLi += errorSummaryPostcode;
            showErrorFields(errorMessagePostcodeNumberID, errorDictionary.address.postcode);
            addErrorClass('govuk-form-group-error-postcode', 'govuk-form-group--error')
            addErrorClass('postcodeID', 'govuk-input--error')
        } else if (!checkPostCodeFormat) {
            errorSummaryLi += errorSummaryPostcodeFormat;
            showErrorFields(errorMessagePostcodeNumberID, errorDictionary.address['postcode-format']);
            addErrorClass('govuk-form-group-error-postcode', 'govuk-form-group--error')
            addErrorClass('postcodeID', 'govuk-input--error')
        }

        document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorSummaryLi);
        document.getElementById("govuk-error-summary").focus();
        flag = false;
    }
}

function submitForm() {
    checkAddress();
    return flag;
}
