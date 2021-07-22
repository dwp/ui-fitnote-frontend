const { expect } = require('chai');
const validateMobileNumber = require('../../../../app/functions/sanitise/validateMobileNumber');

describe("validateMobileNumber", () => {
    it("Should validate invalid mobile number", () => {
        const fieldData = '1234';
        const fieldNumber = validateMobileNumber.mobileValidate(fieldData);
        expect(fieldNumber).to.be.equal(false);
    });

    it("Should validate correct mobile number", () => {
        const fieldData = '01234567101';
        const fieldNumber = validateMobileNumber.mobileValidate(fieldData);
        expect(fieldNumber).to.be.equal(true);
    });

    it("Returns true for a valid mobile number", function() {
        expect(validateMobileNumber.mobileValidate('+09123456789')).to.equal(true);
    });

    it("Returns false for an invalid mobile number", function() {
        expect(validateMobileNumber.mobileValidate('+123456789+')).to.equal(false);
    });
});