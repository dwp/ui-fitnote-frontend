var checkHouseNumber;
var checkPostCode;
var checkPostCodeFormat;
var flag = false;
var ga;
var errorMessageHouseNumberID = document.getElementById('error-message-houseNumberID');
var errorMessagePostcodeNumberID = document.getElementById('error-message-postcodeID');
var houseNumberID = document.getElementById('houseNumberID');
var postcodeID = document.getElementById('postcodeID');
var errorSummaryHouse = '<li class="ls-none"><a href="#houseNumberID" id="error-field-houseNumberID" data-related="houseNumber"  class="bold small gds-red">' + errorDictionary.address['house-number'] + '</a></li>';
var errorSummaryPostcode = '<li class="ls-none"><a href="#postcodeID" id="error-field-postcodeID" data-related="postcode" class="bold small gds-red">' + errorDictionary.address.postcode + '</a></li>';
var errorSummaryPostcodeFormat = '<li class="ls-none"><a href="#postcodeID" id="error-field-postcodeID" data-related="postcode" class="bold small gds-red">' + errorDictionary.address['postcode-format'] + '</a></li>';
var errorSummaryLi;

function isInputEmpty(inputField) {
    if ((inputField.value === '') || (inputField.value === 'null')) {
        return false;
    }
    return true;
}

function showErrorFields(field) {
    field.setAttribute('aria-hidden', false);
    field.parentElement.className = 'form-group error';
}

function hideErrorFields(field) {
    field.setAttribute('aria-hidden', true);
    field.parentElement.className = 'form-group';
}

function getErrorSummary(li) {
    return '<h2 class="bold-medium" id="error-summary-heading">' + errorDictionary['error-summary-h2'] + '</h2><p>'+ errorDictionary['error-summary-p'] +'</p><div id="error-summary-list-id"><ul class="error-summary-list">' + li + '</ul></div>';
}

function isValidPostcode(postcode) {
    var regex = /^(?![QVX])[A-Z]((?![IJZ])[A-Z][0-9]([0-9]?|[ABEHMNPRVWXY]?)|[0-9]([0-9]?|[ABCDEFGHJKPSTUW]?))[0-9](?![CIKMOV])[A-Z]{2}$/;
    return regex.test(postcode.toUpperCase().replace(/[\s|\-]/g, ''));
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

        if (!checkHouseNumber) {
            errorSummaryLi += errorSummaryHouse;
            showErrorFields(errorMessageHouseNumberID);
            ga('send', 'event', 'Error - validation', 'houseNumberID', 'Enter your house number');
        }

        if (!checkPostCode) {
            errorSummaryLi += errorSummaryPostcode;
            showErrorFields(errorMessagePostcodeNumberID);
            ga('send', 'event', 'Error - validation', 'postcodeID', 'Enter your postcode');
        } else if (!checkPostCodeFormat) {
            errorSummaryLi += errorSummaryPostcodeFormat;
            showErrorFields(errorMessagePostcodeNumberID);
            ga('send', 'event', 'Error - validation', 'postcodeID', 'Check postcode format');
        }

        document.getElementById('error-summary').innerHTML = getErrorSummary(errorSummaryLi);
        document.getElementById('error-summary').setAttribute('aria-hidden', false);
    }
}

function submitForm() {
    checkAddress();
    return flag;
}
