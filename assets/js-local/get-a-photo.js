window.onload = function takeAPhoto() {
    var validImageFileTypes = new RegExp('^image/');
    var pageUrl = window.location.pathname;
    var submitBtnContainer = document.getElementById('js-submitButtonContainer');
    var submitButton = document.querySelector('input[type="submit"]')
    
    function showLoader() {
        document.getElementById('js-loading-message').className += 'js-show';
        submitBtnContainer.className = 'js-hide';
        document.getElementById('formData').submit();
        document.getElementById('upload-status').innerHTML+=("<p>Uploading</p>");
        return true;
    }

    submitButton.onclick = function photoChange(e) {
        try {
            if ((!validImageFileTypes.test(e.target.files[0].type) && e.target.files[0].type !== 'application/pdf')) {
                window.location = pageUrl + '?type=1';
            } else if (e.target.files[0].size > 10000000) {
                window.location = pageUrl + '?size=2';
            } else {
                showLoader();
            }
        } catch (err) {
            showLoader();
        }
    };
};
