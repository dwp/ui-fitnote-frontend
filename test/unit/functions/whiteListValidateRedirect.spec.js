const { expect } = require('chai');
const whiteListValidateRedirect = require('../../../app/functions/whiteListValidateRedirect');

describe('whiteListValidateRedirect', () => {
  const validRedirects = [
    '/esa',
    '/no-esa',
    '/method-obtained',
    '/guidance-digital',
    '/guidance-paper',
    '/upload',
    '/cookies/cookie_policy',
    '/accessibility-statement',
    '/photo-audit',
    '/nino',
    '/text-message',
    '/check-your-answers',
    '/feedback',
    '/feedback-sent',
    '/complete',
  ];

  it('should return expected redirect for white listed values', () => {
    validRedirects.forEach((item) => {
      const result = whiteListValidateRedirect(item);
      expect(result).to.be.equal(item);
    });
  });

  it('should return false if redirect is not white listed', () => {
    const invalidRedirect = '/start';
    const result = whiteListValidateRedirect(invalidRedirect);
    expect(result).to.be.equal(false);
  });
});
