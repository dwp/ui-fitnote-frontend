import { expect } from 'chai';
import redirectTimeout from '../../../app/functions/timeoutRedirect.js';

describe('redirectTimeout', () => {
  it('should return session-timeout path', () => {
    const expectedResult = '/session-timeout';
    const result = redirectTimeout();
    expect(result).to.be.equal(expectedResult);
  });
});
