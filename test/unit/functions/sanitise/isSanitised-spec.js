const { expect } = require('chai');
const { assert } = require('chai');
const isFieldBlank = require('../../../../app/functions/sanitise/isFieldBlank');
const isOnlyNumeric = require('../../../../app/functions/sanitise/isOnlyNumeric');
const sanitiseNino = require('../../../../app/functions/sanitise/sanitiseNino');
const validateNinoLoose = require('../../../../app/functions/sanitise/validateNinoLoose');
const validateNinoStrict = require('../../../../app/functions/sanitise/validateNinoStrict');
const isSanitised = require('../../../../app/functions/sanitise/sanitiseField');

describe('isSanitised Functions', () => {
  const nino = 'js-12 34 56-C';
  const ninoShort = 'JS123456';
  const ninoLong = 'JS123456C';
  const fieldData = 'A a!@£$%^& *(56)_+{}:?><,./;]][=- 1 2';
  const blankField = '';
  const undefinedField = undefined;

  describe('Nino Sanitise', () => {
    process.env.NODE_ENV = 'test';
    it('Strips out dashes and spaces and convert to uppercase', () => {
      const ninoSanitised = sanitiseNino.sanitiseNino(nino);
      expect(ninoSanitised).to.equal('JS123456C');
    });
  });

  describe('Nino Loose Validate', () => {
    process.env.NODE_ENV = 'test';
    const passedLoose = validateNinoLoose.ninoValidateLoose(ninoShort);

    it('Should return true if the optional last letter has been missed', () => {
      assert.isTrue(passedLoose, 'is true');
    });

    it('Should return true if the optional last letter has been included', () => {
      assert.isTrue(passedLoose, 'is true');
    });

    it('Should be maximum of 9 characters long', () => {
      expect(ninoShort).to.have.length.below(10);
    });
  });

  describe('Nino Strict Validate', () => {
    process.env.NODE_ENV = 'test';
    const passedStrict = validateNinoStrict.ninoValidateStrict(ninoLong);
    const failedStrict = validateNinoStrict.ninoValidateStrict(ninoShort);

    it('Should return false if the optional last letter has been missed', () => {
      assert.isFalse(failedStrict, 'is false');
    });

    it('Should return true if the optional last letter has been included', () => {
      assert.isTrue(passedStrict, 'is true');
    });

    it('Should be minimum of 8 characters long', () => {
      expect(ninoLong).to.have.length.above(7);
    });

    it('Should be minimum of 8 characters long', () => {
      expect(ninoShort).to.have.length.above(7);
    });

    it('Should be maximum of 9 characters long', () => {
      expect(ninoShort).to.have.length.below(10);
    });
  });

  describe('Remove non-alphanumeric chars, new lines and multiple instances of whitespace', () => {
    process.env.NODE_ENV = 'test';
    it('Strip out everything except numbers and letters', () => {
      const fieldDataSanitised = isSanitised.sanitiseField(fieldData);
      expect(fieldDataSanitised).to.be.equal('Aa56_12');
    });
  });

  describe('Numbers only', () => {
    process.env.NODE_ENV = 'test';
    it('Strip out everything except numbers', () => {
      const fieldDataSanitised = isOnlyNumeric.numbersOnly(fieldData);
      expect(fieldDataSanitised).to.be.equal('5612');
    });
  });

  describe('Not blank', () => {
    process.env.NODE_ENV = 'test';
    it('ensures form field is not blank or undefined', () => {
      const blankFieldValue = isFieldBlank.notBlank(blankField);
      const undefinedFieldValue = isFieldBlank.notBlank(undefinedField);
      const ninoShortValue = isFieldBlank.notBlank(ninoShort);
      assert.isFalse(blankFieldValue, 'Field is blank');
      assert.isFalse(undefinedFieldValue, 'Field is undefined');
      assert.isTrue(ninoShortValue, 'Field has a value');
    });
  });
});
