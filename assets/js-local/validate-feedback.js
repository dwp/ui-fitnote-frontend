var ratingError = document.getElementById('error-message-ratingID');
var improvementsError = document.getElementById('error-message-improvementsID');
var nameError = document.getElementById('error-message-nameID');
var phoneError = document.getElementById('error-message-phoneID');
var errorRating = '<li class="ls-none"><a href="#vSatisfied" id="error-field-vSatisfied" class="bold small gds-red">' + errorDictionary.feedback.required + '</a></li>';
var errorImprovements = '<li class="ls-none"><a href="#improvementsID" id="error-field-improvementsID" class="bold small gds-red">' + errorDictionary.feedback.maxlength + '</a></li>';
var errorName = '<li class="ls-none"><a href="#nameID" id="error-field-nameID" class="bold small gds-red">' + errorDictionary.feedback.name + '</a></li>';
var errorPhone = '<li class="ls-none"><a href="#phoneID" id="error-field-phoneID" class="bold small gds-red">' + errorDictionary.feedback.phone + '</a></li>';

(function onLoady() {
    var radios = document.querySelectorAll('input[name="rating"]');
    function select() {
        for(var j=0; j<radios.length; j++) {
            radios[j].parentElement.className = 'block-label selection-button-radio';
        }
        var selected = document.querySelector('input[name="rating"]:checked');
        selected.parentElement.className = 'block-label selection-button-radio selected';
        ga('send', 'event', 'Radio - click', 'Overall, how did you feel about the service you recevied today?', selected.value + ' - rating', {
            'dimension6': [selected.value + ' - rating']
        });
    }
    for(var i=0; i<radios.length; i++) {
        radios[i].addEventListener('click', select, false);
    }
})();

function getErrorSummary(li) {
    return '<h2 class="bold-medium" id="error-summary-heading">' + errorDictionary['error-summary-h2'] + '</h2><p>'+ errorDictionary['error-summary-p'] +'</p><div id="error-summary-list-id"><ul class="error-summary-list">' + li + '</ul></div>';
}

function hideErrors() {
    ratingError.setAttribute('aria-hidden', true);
    improvementsError.setAttribute('aria-hidden', true);
    nameError.setAttribute('aria-hidden', true);
    phoneError.setAttribute('aria-hidden', true);

    ratingError.parentElement.parentElement.parentElement.className = 'form-group';
    improvementsError.parentElement.parentElement.className = 'form-group';
    
    nameError.parentElement.parentElement.className = 'form-group';
    phoneError.parentElement.parentElement.className = 'form-group';
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

    var submit = document.getElementById('submit-feedback');

    ga('send', 'event', 'Textbox - fill', 'How could we improve this service?', (improvements.value.length) ? 'Filled' : 'Not filled');
    
    if(ratingOK && improvementsOK && nameOK && phoneOK) {
        submit.disabled = true;
        return true;
    } else {
        hideErrors();
        var errorSummaryLi = '';

        if (!ratingOK) {
            errorSummaryLi += errorRating;
            ratingError.setAttribute('aria-hidden', false);
            ratingError.parentElement.parentElement.parentElement.className = 'form-group error';
            ga('send', 'event', 'Error - validation', 'rating', 'Select a satisfaction rating');
        }

        if (!improvementsOK) {
            errorSummaryLi += errorImprovements;
            improvementsError.setAttribute('aria-hidden', false);
            improvementsError.parentElement.parentElement.className = 'form-group error';
            ga('send', 'event', 'Error - validation', 'improvementsID', 'Enter improvement suggestions using 1200 characters or less');
        }
        
        if (!nameOK) {
            errorSummaryLi += errorName;
            nameError.setAttribute('aria-hidden', false);
            nameError.parentElement.parentElement.className = 'form-group error';
            ga('send', 'event', 'Error - validation', 'name', 'Enter a shorter name (maximum 1000 characters)');
        }

        if (!phoneOK) {
            errorSummaryLi += errorPhone;
            phoneError.setAttribute('aria-hidden', false);
            phoneError.parentElement.parentElement.className = 'form-group error';
            ga('send', 'event', 'Error - validation', 'phone', 'Enter a valid phone number');
        }

        document.getElementById('error-summary').innerHTML = getErrorSummary(errorSummaryLi);
        document.getElementById('error-summary').setAttribute('aria-hidden', false);

        return false;
    }
}

function submitForm() {
    return isFormValid();
}
