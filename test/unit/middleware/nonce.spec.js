const { expect } = require('chai');
const sinon = require('sinon');

const { generateNonce, attachNonceToLocals } = require('../../../app/middleware/nonce');

describe('nonce', () => {
  describe('generateNonce', () => {
    it('should generate nonce', () => {
      const nonce = generateNonce();

      expect(nonce.length).to.be.equal(24);
    });
  });

  describe('attachNonceToLocals', () => {
    it('should attach nonce to res and call next', () => {
      const nonce = generateNonce();

      const middleware = attachNonceToLocals(nonce);
      const req = {};
      const res = { locals: {} };
      const next = sinon.spy();

      middleware(req, res, next);

      expect(res.locals.nonce).to.be.equal(nonce);
      expect(next.calledOnce).to.be.equal(true);
    });
  });
});
