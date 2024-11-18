const { expect } = require('chai');
const { redirectTimeout } = require('../../../app/functions/timeoutRedirect');

describe('redirectTimeout', () => {
  it('should return session-timeout path', () => {
    const expectedResult = '/session-timeout';
    const result = redirectTimeout();
    expect(result).to.be.equal(expectedResult);
  });
});
