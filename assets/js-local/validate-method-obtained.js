var flag = false;

(function onLoady() {
    document.getElementById('method-obtained-paper').addEventListener('click', null, false);
    document.getElementById('method-obtained-sms').addEventListener('click', null, false);
    document.getElementById('method-obtained-email').addEventListener('click', null, false);
})();

function getErrorSummary(msg) {
    return '<li>' +
        '<a href="#method-obtained-paper">' + msg + '</a>' +
        '</li>'
}

function showErrorFields(field) {
    field.setAttribute('aria-hidden', false);
}

function addErrorClass(id, className) {
    var element = document.getElementById(id);
    element.classList.add(className);
  }

function checkMethodObtained() {
    var errorMessageFieldID = document.getElementById('method-obtained-error');
    var radioValueRaw = document.querySelector('input[name="methodObtained"]:checked');

    if (radioValueRaw !== null) {
        flag = true;
    } else {
        document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary['method-obtained'].missing);
        showErrorFields(errorMessageFieldID);
        addErrorClass('govuk-form-group-error', 'govuk-form-group--error')
        document.getElementById("govuk-error-summary").focus();
        flag = false;
    }
}

function submitForm() {
    checkMethodObtained();
    return flag;
}
