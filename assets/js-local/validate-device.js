var flag = false;

(function onLoady() {
    document.getElementById('radioPhone').addEventListener('click', null, false);
    document.getElementById('radioDesktop').addEventListener('click', null, false);
})();

function getErrorSummary(msg){
    return '<h2 class="govuk-heading-m govuk-!-font-weight-bold" id="error-summary-heading">' + errorDictionary['error-summary-h2'] + '</h2><p>'+ errorDictionary['error-summary-p'] +'</p><div id="error-summary-list-id"><ul class="error-summary-list"><li class="ls-none"><a href="#radioPhone" id="error-field-radioPhone" data-related="mobile" class="govuk-!-font-weight-bold govuk-body-s gds-red">'+ msg+'</a></li></ul></div>'
}

function showErrorFields(field) {
    field.setAttribute('aria-hidden', false);
    field.parentElement.parentElement.parentElement.className = 'form-group error';
}

function checkDevice() {
    var errorMessageDeviceFieldID = document.getElementById('error-message-radioPhone');
    var radioValueRaw = document.querySelector('input[name="device"]:checked');

    if (radioValueRaw !== null) {
        flag = true;
    } else {
        document.getElementById('error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary').innerHTML = getErrorSummary(errorDictionary['device'].missing);
        showErrorFields(errorMessageDeviceFieldID);
        flag = false;
    }
}

function submitForm() {
    checkDevice();
    return flag;
}
