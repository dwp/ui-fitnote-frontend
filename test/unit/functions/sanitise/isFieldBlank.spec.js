const { expect } = require('chai');
const { notBlank } = require('../../../../app/functions/sanitise/isFieldBlank');

describe('isFieldBlank', () => {
  it('should return false when field is empty string ', () => {
    const emptyString = '';
    expect(notBlank(emptyString)).to.be.equal(false);
  });

  it('should return false when field is undefined var ', () => {
    const undefinedVar = undefined;
    expect(notBlank(undefinedVar)).to.be.equal(false);
  });

  it('should return true when field is populated ', () => {
    const string = 'abc-123';
    expect(notBlank(string)).to.be.equal(true);
  });
});
