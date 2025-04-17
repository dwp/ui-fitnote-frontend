import { expect } from 'chai';
import ninoValidateStrict from '../../../../app/functions/sanitise/validateNinoStrict.js';

describe('ninoValidateStrict', () => {
  it('should return true when valid nino', () => {
    const nino = 'JS123456C';
    const result = ninoValidateStrict(nino);
    expect(result).to.be.equal(true);
  });

  it('should return false when nino has last letter missing', () => {
    const ninoShort = 'JS123456';
    const result = ninoValidateStrict(ninoShort);
    expect(result).to.be.equal(false);
  });

  it('should return false when input nino is not valid', () => {
    const nino = '12346CJS';
    const result = ninoValidateStrict(nino);
    expect(result).to.be.equal(false);
  });
});
