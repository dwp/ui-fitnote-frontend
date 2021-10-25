// Generates a nonce and attach it to res.locals to be used in templates for GTM
const crypto = require('crypto');

const cspHeaderName = 'Content-Security-Policy';

function nonce(req, res, next) {
  const nce = crypto.randomBytes(16).toString('base64'); // generate a random n-once
  const csp = res.get(cspHeaderName); // get CSP header
  res.setHeader(cspHeaderName, `${csp} 'nonce-${nce}'`); // Append n-once to it
  res.locals.nonce = nce; // attach n-once to locals to make it avaialbe in views
  next();
}

module.exports = nonce;
