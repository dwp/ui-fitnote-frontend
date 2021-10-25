const { expect } = require('chai');
const validatePostcode = require('../../../../app/functions/sanitise/validatePostcode');

describe('validatePostcode', () => {
  it('should validate postcode', () => {
    const fieldData = 'XO1 2OX';
    const fieldValidatePostcode = validatePostcode.validatePostcode(fieldData);
    expect(fieldValidatePostcode).to.be.equal(0);
  });

  it('should validate empty postcode', () => {
    const fieldData = '';
    const fieldValidatePostcode = validatePostcode.validatePostcode(fieldData);
    expect(fieldValidatePostcode).to.be.equal(2);
  });

  it('should validate null postcode', () => {
    const fieldData = 'null';
    const fieldValidatePostcode = validatePostcode.validatePostcode(fieldData);
    expect(fieldValidatePostcode).to.be.equal(2);
  });

  it('Returns 1 for a valid postcode ', () => {
    expect(validatePostcode.validatePostcode('LS11DD')).to.equal(1);
    expect(validatePostcode.validatePostcode('LS11DD')).to.equal(1);
    expect(validatePostcode.validatePostcode('W1A1HH')).to.equal(1);
    expect(validatePostcode.validatePostcode('AA9A9AA')).to.equal(1);
    expect(validatePostcode.validatePostcode('A9A9AA')).to.equal(1);
    expect(validatePostcode.validatePostcode('A9A9AA')).to.equal(1);
    expect(validatePostcode.validatePostcode('A9A9AA')).to.equal(1);
    expect(validatePostcode.validatePostcode('A99AA')).to.equal(1);
    expect(validatePostcode.validatePostcode('A999AA')).to.equal(1);
    expect(validatePostcode.validatePostcode('AA99AA')).to.equal(1);
    expect(validatePostcode.validatePostcode('AA999AA')).to.equal(1);
  });

  it('Returns 0 for an invalid postcode', () => {
    expect(validatePostcode.validatePostcode('ABCD')).to.equal(0);
    expect(validatePostcode.validatePostcode('L11A1BD')).to.equal(0);
    expect(validatePostcode.validatePostcode('12345')).to.equal(0);
    expect(validatePostcode.validatePostcode('LS3 3DP')).to.equal(0);
  });
});
