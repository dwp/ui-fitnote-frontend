import { expect } from 'chai';
import validateMobileNumber from '../../../../app/functions/sanitise/validateMobileNumber.js';

describe('validateMobileNumber', () => {
  it('Should validate invalid mobile number', () => {
    const fieldData = '1234';
    const fieldNumber = validateMobileNumber(fieldData);
    expect(fieldNumber).to.be.equal(false);
  });

  it('Should validate correct mobile number', () => {
    const fieldData = '01234567101';
    const fieldNumber = validateMobileNumber(fieldData);
    expect(fieldNumber).to.be.equal(true);
  });

  it('Returns true for a valid mobile number', () => {
    expect(validateMobileNumber('+09123456789')).to.equal(true);
  });

  it('Returns false for an invalid mobile number', () => {
    expect(validateMobileNumber('+123456789+')).to.equal(false);
  });
});
