import { expect } from 'chai';
import encode from '../../../app/functions/base64Encode.js';

describe('Base 64', () => {
  it('Encodes a file', () => {
    const text = 'its_called_a_sick_note_obviously';
    const viaFunction = encode(text);

    const manual = text.toString('base64');
    expect(viaFunction).to.equal(manual);
  });
});
