var ga;
var flag = false;

(function onLoady() {
    var phonePanel = document.querySelector('#phone-panel');
    var desktopPanel = document.querySelector('#desktop-panel');
    phonePanel.style.display = 'none';
    desktopPanel.style.display = 'none';
    
    function radioClicked() {
        var radioValue = document.querySelector('input[name="device"]:checked').value;
        if (radioValue === 'phone') {
            document.getElementById('phoneLabel').className = 'block-label selection-button-radio selected';
            document.getElementById('desktopLabel').className = 'block-label selection-button-radio';
            phonePanel.style.display = 'block';
            desktopPanel.style.display = 'none';
        } else {
            document.getElementById('desktopLabel').className = 'block-label selection-button-radio selected';
            document.getElementById('phoneLabel').className = 'block-label selection-button-radio';
            phonePanel.style.display = 'none';
            desktopPanel.style.display = 'block';
        }
        ga('send', 'event', 'Radio - click', 'Which of the following are you using?', radioValue + ' - device', {'dimension7' : radioValue + ' - device'});
    }
    document.getElementById('radioPhone').addEventListener('click', radioClicked, false);
    document.getElementById('radioDesktop').addEventListener('click', radioClicked, false);
})();

function getErrorSummary(msg){
    return '<h2 class="bold-medium" id="error-summary-heading">' + errorDictionary['error-summary-h2'] + '</h2><p>'+ errorDictionary['error-summary-p'] +'</p><div id="error-summary-list-id"><ul class="error-summary-list"><li class="ls-none"><a href="#radioPhone" id="error-field-radioPhone" data-related="mobile" class="bold small gds-red">'+ msg+'</a></li></ul></div>'
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
    if (flag === false) {
        ga('send', 'event', 'Error - validation', 'device', 'Select the type of device you are using');
    }
    return flag;
}
