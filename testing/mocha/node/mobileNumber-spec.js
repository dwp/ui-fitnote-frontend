process.env.NODE_ENV = 'test';

describe("mobile number validation", function() {

    var expect = require('chai').expect;
    var mobileNumberValidator = require('../../../app/functions/sanitise/validateMobileNumber.js');

    it("Returns true for a valid mobile number", function() {
        expect(mobileNumberValidator.mobileValidate('+123456789')).to.equal(true);
    });

    it("Returns false for an invalid mobile number", function() {
        expect(mobileNumberValidator.mobileValidate('+123456789+')).to.equal(false);
    });
});
