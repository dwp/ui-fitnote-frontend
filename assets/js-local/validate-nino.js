var convertedNino;
var passedNino;
var checkNinoField;
var ga;
var gaOutcome;
var flag = false;

function sanitiseNino(nino) {
    return nino.toUpperCase().replace(/[\s|\-]/g, '');
}

function ninoValidateStrict(nino) {
    var regex = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/;
    return regex.test(nino);
}

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

function getErrorSummary(msg){
    return '<h2 class="bold-medium" id="error-summary-heading">' + errorDictionary['error-summary-h2'] + '</h2><p>'+ errorDictionary['error-summary-p'] +'</p><div id="error-summary-list-id"><ul class="error-summary-list"><li class="ls-none"><a href="#ninoFieldID" id="error-field-ninoFieldID" data-related="nino" class="bold small gds-red">' + msg + '</a></li></ul></div>';
}

function checkNino() {
    var ninoFieldID = document.getElementById('ninoFieldID');
    var errorMessageNinoFieldID = document.getElementById('error-message-ninoFieldID');

    checkNinoField = isInputEmpty(ninoFieldID);

    if (checkNinoField === true) {
        convertedNino = sanitiseNino(ninoFieldID.value);
        passedNino =  ninoValidateStrict(convertedNino);

        if (passedNino === true) {
            flag = true;
        } else {
            document.getElementById('error-summary').setAttribute('aria-hidden', false);
            document.getElementById('error-summary').innerHTML = getErrorSummary(errorDictionary.nino['nino-format']);
            showErrorFields(errorMessageNinoFieldID);
            flag = false;
            gaOutcome = 1;
        }
    } else {
        document.getElementById('error-summary').setAttribute('aria-hidden', false);
        document.getElementById('error-summary').innerHTML = getErrorSummary(errorDictionary.nino.nino);
        showErrorFields(errorMessageNinoFieldID);
        flag = false;
        gaOutcome = 2;
    }
}

function sendGa(gaValue) {
    switch (gaValue) {
    case 1 :
        ga('send', 'event', 'Error - validation', 'ninoFieldID', 'Enter a valid National Insurance number format. For example, QQ123456C');
        break;
    case 2 :
        ga('send', 'event', 'Error - validation', 'ninoFieldID', 'Enter your National Insurance number');
        break;
    default:
        ga('send', 'event', 'Error - validation', 'ninoFieldID', 'unknown error');
    }
}

function submitForm() {
    checkNino();
    if (flag === false) {
        sendGa(gaOutcome);
    }
    return flag;
}
