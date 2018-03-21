process.env.NODE_ENV = 'test';

describe("postcode validation", function() {

    var expect = require('chai').expect;
    var postcodeValidate = require('../../../app/functions/sanitise/validatePostcode');

    it("Returns 1 for a valid postcode ", function() {
        expect(postcodeValidate.validatePostcode('LS11DD')).to.equal(1);
        expect(postcodeValidate.validatePostcode('LS11DD')).to.equal(1);
        expect(postcodeValidate.validatePostcode('W1A1HH')).to.equal(1);
        expect(postcodeValidate.validatePostcode('AA9A9AA')).to.equal(1);
        expect(postcodeValidate.validatePostcode('A9A9AA')).to.equal(1);
        expect(postcodeValidate.validatePostcode('A9A9AA')).to.equal(1);
        expect(postcodeValidate.validatePostcode('A9A9AA')).to.equal(1);
        expect(postcodeValidate.validatePostcode('A99AA')).to.equal(1);
        expect(postcodeValidate.validatePostcode('A999AA')).to.equal(1);
        expect(postcodeValidate.validatePostcode('AA99AA')).to.equal(1);
        expect(postcodeValidate.validatePostcode('AA999AA')).to.equal(1);
        
    });

    it("Returns 0 for an invalid postcode", function() {
        expect(postcodeValidate.validatePostcode('ABCD')).to.equal(0);
        expect(postcodeValidate.validatePostcode('L11A1BD')).to.equal(0);
        expect(postcodeValidate.validatePostcode('12345')).to.equal(0);
        expect(postcodeValidate.validatePostcode('LS3 3DP')).to.equal(0);

    });
});
