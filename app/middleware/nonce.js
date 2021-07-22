// Generates a nonce and attach it to res.locals to be used in templates for GTM
const crypto = require('crypto');
const cspHeaderName = 'Content-Security-Policy';

const nonce = function(req, res, next) {
    const nonce = crypto.randomBytes(16).toString('base64'); // generate a random n-once
    const csp = res.get(cspHeaderName); // get CSP header
    res.setHeader(cspHeaderName, `${csp} 'nonce-${nonce}'`); // Append n-once to it
    res.locals.nonce = nonce; // attach n-once to locals to make it avaialbe in views
    next();
};

module.exports = nonce;
