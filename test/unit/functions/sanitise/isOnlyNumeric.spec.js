const { expect } = require('chai');
const { numbersOnly } = require('../../../../app/functions/sanitise/isOnlyNumeric');

describe('isOnlyNumeric', () => {
  it('should return only numeric values when given alphanumeric and special characters', () => {
    const text = 'a-1B-2*c!3';
    const expectedResult = '123';
    const result = numbersOnly(text);
    expect(result).to.be.equal(expectedResult);
  });

  it('should return only numeric values when given numbers only', () => {
    const text = '123';
    const expectedResult = '123';
    const result = numbersOnly(text);
    expect(result).to.be.equal(expectedResult);
  });
});