import { expect } from 'chai';
import sinon from 'sinon';

import { generateNonce, attachNonceToLocals } from '../../../app/middleware/nonce.js';

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
