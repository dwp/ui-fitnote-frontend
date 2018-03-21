window.onload = function takeAPhoto() {
    var userPhotoID = document.getElementById('userPhotoID');
    var userPhotoIDLabel = document.getElementById('userPhotoIDLabel');
    userPhotoID.className += ' js-hide';
    
    function showLoader() {
        document.getElementById('js-loading-message').className = 'js-show';
        userPhotoIDLabel.className = 'js-hide';
        document.getElementById('formData').submit();
        return true;
    }

    userPhotoIDLabel.className = 'button primary-button';
    document.getElementById('js-submitButtonContainer').className = 'js-hide';
    userPhotoID.onchange = function photoChange(e) {
        try {
            if (e.target.files[0].size < 500000 && 
                e.target.files[0].type !== 'application/pdf') {
                window.location = '/422-desktop';
            } else {
                showLoader();
            }
        } catch (e) {
            showLoader();
        }
    };
};
