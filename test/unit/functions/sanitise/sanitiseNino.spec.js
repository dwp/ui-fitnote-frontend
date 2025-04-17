import { expect } from 'chai';
import sanitiseNino from '../../../../app/functions/sanitise/sanitiseNino.js';

describe('sanitiseNino', () => {
  it('should return sanitised nino (removing spaces and hyphens)', () => {
    const text = 'js-12 34 56-C';
    const expectedResult = 'JS123456C';
    const result = sanitiseNino(text);
    expect(result).to.be.equal(expectedResult);
  });
});
