var flag = false;

(function onLoady() {
    document.getElementById('radioIdentifyYes').addEventListener('click', null, false);
    document.getElementById('radioIdentifyNo').addEventListener('click', null, false);
})();

function getErrorSummary(msg) {
    return '<li>' +
        '<a href="#radioIdentifyYes"">' + msg + '</a>' +
        '</li>'
}

function showErrorFields(field) {
    field.setAttribute('aria-hidden', false);
}

function addErrorClass(id, className) {
    var element = document.getElementById(id);
    element.classList.add(className);
}

function checkIdentify() {
    var errorMessageDeviceFieldID = document.getElementById('error-message-radioIdentify');
    var radioValueRaw = document.querySelector('input[name="identify"]:checked');

    if (radioValueRaw !== null) {
        flag = true;
    } else {
        document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary['identify'].missing);
        showErrorFields(errorMessageDeviceFieldID);
        addErrorClass('govuk-form-group-error', 'govuk-form-group--error')
        document.getElementById("govuk-error-summary").focus();
        flag = false;
    }
}

function submitForm() {
    checkIdentify();
    return flag;
}