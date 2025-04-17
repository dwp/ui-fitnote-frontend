import { expect } from 'chai';
import ninoValidateLoose from '../../../../app/functions/sanitise/validateNinoLoose.js';

describe('ninoValidateLoose', () => {
  it('should validate nino with optional last letter missing', () => {
    const ninoShort = 'JS123456';
    const result = ninoValidateLoose(ninoShort);
    expect(result).to.be.equal(true);
  });

  it('should validate nino with optional last letter provided', () => {
    const nino = 'JS123456C';
    const result = ninoValidateLoose(nino);
    expect(result).to.be.equal(true);
  });

  it('should return false when input nino is not valid', () => {
    const nino = '12346CJS';
    const result = ninoValidateLoose(nino);
    expect(result).to.be.equal(false);
  });
});
