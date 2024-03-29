var flag = false;

(function onLoady() {
    document.getElementById('method-obtained-paper').addEventListener('click', null, false);
    document.getElementById('method-obtained-digital').addEventListener('click', null, false);
    document.getElementById("formData").onsubmit = function() {return submitForm()};
})();

function getErrorSummary(msg) {
    return '<li>' +
        '<a href="#method-obtained-paper">' + msg + '</a>' +
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

function checkMethodObtained() {
    var errorMessageFieldID = document.getElementById('method-obtained-error');
    var radioValueRaw = document.querySelector('input[name="methodObtained"]:checked');

    if (radioValueRaw !== null) {
        flag = true;
    } else {
        document.title =  errorPageTitle
        document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary['method-obtained'].missing);
        showErrorFields(errorMessageFieldID, errorDictionary['method-obtained'].missing);
        addErrorClass('govuk-form-group-error', 'govuk-form-group--error')
        document.getElementById("govuk-error-summary").focus();
        flag = false;
    }
}

function submitForm() {
    checkMethodObtained();
    return flag;
}
