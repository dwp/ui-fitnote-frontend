exports.mobileValidate = function mobileValidate(mobile) {
    var regex = /^\+?[ 0-9]{9,15}$/;
    return regex.test(mobile);
};
