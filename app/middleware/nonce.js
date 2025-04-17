// Generates a nonce and attach it to res.locals to be used in templates for GTM
import crypto from 'crypto';

export function generateNonce() {
  // generate a random nonce
  return crypto.randomBytes(16).toString('base64');
}

export function attachNonceToLocals(nonce) {
  return function (req, res, next) {
    // attach nonce to locals to make it available in views
    res.locals.nonce = nonce;
    next();
  };
}
