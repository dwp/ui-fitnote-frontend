var expect = require('chai').expect;

describe("Base 64", function() {
    var encode = require('../../../app/functions/base64Encode');
    process.env.NODE_ENV = 'test';
    
    it("Encodes a file", function() {
        var text = 'its_called_a_sick_note_obviously';
        var viaFunction = encode.convertBase64(text);

        var manual = text.toString('base64');
        expect(viaFunction).to.equal(manual);
    });
});
