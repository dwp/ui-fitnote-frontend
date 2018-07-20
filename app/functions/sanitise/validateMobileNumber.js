exports.mobileValidate = function mobileValidate(mobile) {
    var regex = /^\+?[ 0-9]{11,20}$/;
    return regex.test(mobile);
};
