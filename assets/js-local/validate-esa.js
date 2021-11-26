var flag = false;

(function onLoady() {
    document.getElementById('radioEsaYes').addEventListener('click', null, false);
    document.getElementById('radioEsaNo').addEventListener('click', null, false);
})();

function getErrorSummary(msg) {
    return '<li>' +
        '<a href="#radioEsaYes"">' + msg + '</a>' +
        '</li>'
}

function showErrorFields(field, message) {
    field.setAttribute('aria-hidden', false);
    field.innerHTML = '<span class="govuk-visually-hidden">Error:</span>' + message;
}

function addErrorClass(id, className) {
    var element = document.getElementById(id);
    element.classList.add(className);
}

function checkEsa() {
    var errorMessageDeviceFieldID = document.getElementById('error-message-radioEsa');
    var radioValueRaw = document.querySelector('input[name="esa"]:checked');

    if (radioValueRaw !== null) {
        flag = true;
    } else {
        document.title =  errorPageTitle
        document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary['esa'].missing);
        showErrorFields(errorMessageDeviceFieldID, errorDictionary['esa'].missing);
        addErrorClass('govuk-form-group-error', 'govuk-form-group--error')
        document.getElementById("govuk-error-summary").focus();
        flag = false;
    }
}

function submitForm() {
    checkEsa();
    return flag;
}
