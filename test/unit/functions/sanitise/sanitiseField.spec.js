const { expect } = require('chai');
const { sanitiseField } = require('../../../../app/functions/sanitise/sanitiseField');

describe('sanitiseField', () => {
  it('should return sanitised text (removing non-alphanumerics, new lines and multiple whitespaces)', () => {
    const text = `
A*B!?C-123
   XY
Z
`;
    const expectedResult = 'ABC123XYZ';
    const result = sanitiseField(text);
    expect(result).to.be.equal(expectedResult);
  });

  it('should return sanitised text with no changes when text is acceptable', () => {
    const text = 'ABC123XYZ';
    const expectedResult = 'ABC123XYZ';
    const result = sanitiseField(text);
    expect(result).to.be.equal(expectedResult);
  });
});
