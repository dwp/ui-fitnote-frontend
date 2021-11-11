var ratingError = document.getElementById('error-message-ratingID');
var improvementsError = document.getElementById('error-message-improvementsID');
var nameError = document.getElementById('error-message-nameID');
var phoneError = document.getElementById('error-message-phoneID');
var errorRating = '<li><a href="#vSatisfied">' + errorDictionary.feedback.required + '</a></li>';
var errorImprovements = '<li><a href="#improvementsID">' + errorDictionary.feedback.maxlength + '</a></li>';
var errorName = '<li><a href="#nameID">' + errorDictionary.feedback.name + '</a></li>';
var errorPhone = '<li><a href="#phoneID">' + errorDictionary.feedback.phone + '</a></li>';
var flag = false;

function getErrorSummary(li) {
    return li
}

function hideErrors() {
    ratingError.setAttribute('aria-hidden', true);
    improvementsError.setAttribute('aria-hidden', true);
    nameError.setAttribute('aria-hidden', true);
    phoneError.setAttribute('aria-hidden', true);

    document.getElementById('govuk-form-group-error-rating').classList.remove('govuk-form-group--error');
    document.getElementById('govuk-form-group-error-improvements').classList.remove('govuk-form-group--error');
    document.getElementById('govuk-form-group-error-name').classList.remove('govuk-form-group--error');
    document.getElementById('govuk-form-group-error-phone').classList.remove('govuk-form-group--error');

    document.getElementById('improvementsID').classList.remove('govuk-textarea--error');
    document.getElementById('nameID').classList.remove('govuk-input--error');
    document.getElementById('phoneID').classList.remove('govuk-input--error');
}

function addErrorClass(id, className) {
    var element = document.getElementById(id);
    element.classList.add(className);
}

function isFormValid() {

    var selected = document.querySelector('input[name="rating"]:checked');
    var improvements = document.getElementById('improvementsID');
    var name = document.getElementById('nameID');
    var phone = document.getElementById('phoneID');

    var ratingOK = selected != null;
    var improvementsOK = improvements.value.length <= 1200;
    var nameOK = name.value.length <= 1000;
    var phoneOK = phone.value.length <= 1000 && (phone.value.length === 0 || phone.value.replace(/[^0-9]+/g, '').length > 8);

    flag = ratingOK && improvementsOK && nameOK && phoneOK
    if(!flag) {
        hideErrors();
        var errorSummaryLi = '';
        if (!ratingOK) {
            document.title =  errorPageTitle;
            errorSummaryLi += errorRating;
            ratingError.setAttribute('aria-hidden', false);
            addErrorClass('govuk-form-group-error-rating', 'govuk-form-group--error')
        }

        if (!improvementsOK) {
            document.title =  errorPageTitle;
            errorSummaryLi += errorImprovements;
            improvementsError.setAttribute('aria-hidden', false);
            addErrorClass('improvementsID', 'govuk-textarea--error')
            addErrorClass('govuk-form-group-error-improvements', 'govuk-form-group--error')
        }

        if (!nameOK) {
            document.title =  errorPageTitle;
            errorSummaryLi += errorName;
            nameError.setAttribute('aria-hidden', false);
            addErrorClass('nameID', 'govuk-input--error')
            addErrorClass('govuk-form-group-error-name', 'govuk-form-group--error')
        }

        if (!phoneOK) {
            document.title =  errorPageTitle;
            errorSummaryLi += errorPhone;
            phoneError.setAttribute('aria-hidden', false);
            addErrorClass('phoneID', 'govuk-input--error')
            addErrorClass('govuk-form-group-error-phone', 'govuk-form-group--error')
        }

        document.getElementById('error-summary-list').innerHTML = getErrorSummary(errorSummaryLi);
        document.getElementById('govuk-error-summary').setAttribute('aria-hidden', false);
        document.getElementById("govuk-error-summary").focus();
        flag = false;
    }
}

function submitForm() {
    isFormValid();
    return flag;
}
