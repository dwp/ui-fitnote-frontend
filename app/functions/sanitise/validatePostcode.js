exports.validatePostcode = function validatePostcode(postcode) {
    var regex = /^(?![QVX])[A-Z]((?![IJZ])[A-Z][0-9]([0-9]?|[ABEHMNPRVWXY]?)|[0-9]([0-9]?|[ABCDEFGHJKPSTUW]?))[0-9](?![CIKMOV])[A-Z]{2}$/;
    if ((postcode === '') || (postcode === 'null')) {
        return 2;
    }
    return regex.test(postcode) ? 1 : 0;
};
