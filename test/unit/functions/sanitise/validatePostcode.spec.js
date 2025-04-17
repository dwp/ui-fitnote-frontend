import { expect } from 'chai';
import validatePostcode from '../../../../app/functions/sanitise/validatePostcode.js';

describe('validatePostcode', () => {
  it('should validate postcode', () => {
    const fieldData = 'XO1 2OX';
    const fieldValidatePostcode = validatePostcode(fieldData);
    expect(fieldValidatePostcode).to.be.equal(0);
  });

  it('should validate empty postcode', () => {
    const fieldData = '';
    const fieldValidatePostcode = validatePostcode(fieldData);
    expect(fieldValidatePostcode).to.be.equal(2);
  });

  it('should validate null postcode', () => {
    const fieldData = 'null';
    const fieldValidatePostcode = validatePostcode(fieldData);
    expect(fieldValidatePostcode).to.be.equal(2);
  });

  it('Returns 1 for a valid postcode ', () => {
    expect(validatePostcode('LS11DD')).to.equal(1);
    expect(validatePostcode('LS11DD')).to.equal(1);
    expect(validatePostcode('W1A1HH')).to.equal(1);
    expect(validatePostcode('AA9A9AA')).to.equal(1);
    expect(validatePostcode('A9A9AA')).to.equal(1);
    expect(validatePostcode('A9A9AA')).to.equal(1);
    expect(validatePostcode('A9A9AA')).to.equal(1);
    expect(validatePostcode('A99AA')).to.equal(1);
    expect(validatePostcode('A999AA')).to.equal(1);
    expect(validatePostcode('AA99AA')).to.equal(1);
    expect(validatePostcode('AA999AA')).to.equal(1);
  });

  it('Returns 0 for an invalid postcode', () => {
    expect(validatePostcode('ABCD')).to.equal(0);
    expect(validatePostcode('L11A1BD')).to.equal(0);
    expect(validatePostcode('12345')).to.equal(0);
    expect(validatePostcode('LS3 3DP')).to.equal(0);
  });
});
