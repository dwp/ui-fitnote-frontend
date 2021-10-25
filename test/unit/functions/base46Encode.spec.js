const { expect } = require('chai');
const encode = require('../../../app/functions/base64Encode');

describe('Base 64', () => {
  it('Encodes a file', () => {
    const text = 'its_called_a_sick_note_obviously';
    const viaFunction = encode.convertBase64(text);

    const manual = text.toString('base64');
    expect(viaFunction).to.equal(manual);
  });
});
