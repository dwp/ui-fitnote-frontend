var expect = require('chai').expect;
var assert = require('chai').assert;
var should = require('chai').should;

describe("isSanitised Functions", function() {
    var isFieldBlank = require('../../../app/functions/sanitise/isFieldBlank');
    var isOnlyNumeric = require('../../../app/functions/sanitise/isOnlyNumeric');
    var sanitiseNino = require('../../../app/functions/sanitise/sanitiseNino');
    var validateNinoLoose = require('../../../app/functions/sanitise/validateNinoLoose');
    var validateNinoStrict = require('../../../app/functions/sanitise/validateNinoStrict');
    var isSanitised = require('../../../app/functions/sanitise/sanitiseField');
    var nino = 'js-12 34 56-C';
    var ninoShort = 'JS123456';
    var ninoLong = 'JS123456C';
    var fieldData = 'A a!@£$%^& *(56)_+{}:?><,./;]\][=- 1 2';
    var lengthDataExact = '12345678';
    var lengthDataLong = '123456789';
    var lengthDataShort = '1234567';
    var numbersField ='12345678923';
    var lettersField = 'aAbBcCdDeEfFgG';
    var numbersAndLettersField = 'a1A2b2B3c4C5';
    var symbolsField = '!@##@$%^&*(){}|":?><';
    var symbolsNumbersAndLettersField = '!@#@#$%$&^*12312aserf';
    var fieldsIdentical1 = 'doppelganger!';
    var fieldsIdentical2 = 'doppelganger!';
    var blankField = '';
    var undefinedField = undefined;

    describe("Nino Sanitise", function() {
        process.env.NODE_ENV = 'test';
         it("Strips out dashes and spaces and convert to uppercase", function() {
            var ninoSanitised = sanitiseNino.sanitiseNino(nino);
            expect(ninoSanitised).to.equal('JS123456C');
        });
    });

    describe("Nino Loose Validate", function() {
        process.env.NODE_ENV = 'test';
        var passedLoose =  validateNinoLoose.ninoValidateLoose(ninoShort);

        it("Should return true if the optional last letter has been missed", function() {
            assert.isTrue(passedLoose, 'is true');
        });

        it("Should return true if the optional last letter has been included", function() {
            assert.isTrue(passedLoose, 'is true');
        });

        it("Should be minimum of 8 characters long", function() {
            expect(ninoLong).to.have.length.above(7);
        });

        it("Should be minimum of 8 characters long", function() {
            expect(ninoShort).to.have.length.above(7);
        });

        it("Should be maximum of 9 characters long", function() {
            expect(ninoShort).to.have.length.below(10);
        });
    });

    describe("Nino Strict Validate", function() {
        process.env.NODE_ENV = 'test';
        var passedStrict =  validateNinoStrict.ninoValidateStrict(ninoLong);
        var failedStrict =  validateNinoStrict.ninoValidateStrict(ninoShort);

        it("Should return false if the optional last letter has been missed", function() {
            assert.isFalse(failedStrict, 'is false');
        });

        it("Should return true if the optional last letter has been included", function() {
            assert.isTrue(passedStrict, 'is true');
        });

        it("Should be minimum of 8 characters long", function() {
            expect(ninoLong).to.have.length.above(7);
        });

        it("Should be minimum of 8 characters long", function() {
            expect(ninoShort).to.have.length.above(7);
        });

        it("Should be maximum of 9 characters long", function() {
            expect(ninoShort).to.have.length.below(10);
        });
    });

    describe("Remove non-alphanumeric chars, new lines and multiple instances of whitespace", function() {
        process.env.NODE_ENV = 'test';
         it("Strip out everything except numbers and letters", function() {
           var fieldDataSanitised = isSanitised.sanitiseField(fieldData);
            expect(fieldDataSanitised).to.be.equal('Aa56_12');
        });
    });

    describe("Numbers only", function() {
        process.env.NODE_ENV = 'test';
         it("Strip out everything except numbers", function() {
           var fieldDataSanitised = isOnlyNumeric.numbersOnly(fieldData);
            expect(fieldDataSanitised).to.be.equal('5612');
        });
    });

    describe("Not blank", function() {
        process.env.NODE_ENV = 'test';
        it("ensures form field is not blank or undefined", function() {
            var blankFieldValue = isFieldBlank.notBlank(blankField);
            var undefinedFieldValue = isFieldBlank.notBlank(undefinedField);
            var ninoShortValue = isFieldBlank.notBlank(ninoShort);
            assert.isFalse(blankFieldValue, "Field is blank");
            assert.isFalse(undefinedFieldValue, "Field is undefined");
            assert.isTrue(ninoShortValue, "Field has a value");
        });
    });
});
