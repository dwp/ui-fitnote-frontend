var flag = false;

(function onLoady() {
    document.getElementById('radioEsa').addEventListener('click', null, false);
    document.getElementById('radioGroup').addEventListener('click', null, false);
    document.getElementById('radioNotSure').addEventListener('click', null, false);
    document.getElementById("formData").onsubmit = function() {return submitForm()};
})();


function getErrorSummary(msg) {
    return '<li>' +
        '<a href="#radioEsa"">' + msg + '</a>' +
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
    var errorMessageDeviceFieldID = document.getElementById('error-message-radioFitnoteNeeded');
    var radioValueRaw = document.querySelector('input[name="fitnoteNeeded"]:checked');

    if (radioValueRaw !== null) {
        flag = true;
    } else {
        document.title =  errorPageTitle
        document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorDictionary['fitnote-needed'].missing);
        showErrorFields(errorMessageDeviceFieldID, errorDictionary['fitnote-needed'].missing);
        addErrorClass('govuk-form-group-error', 'govuk-form-group--error')
        document.getElementById("govuk-error-summary").focus();
        flag = false;
    }
}

function submitForm() {
    checkEsa();
    return flag;
}
