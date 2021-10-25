const config = require('config');
const logger = require('../../functions/bunyan');
const hasTimedOut = require('../../functions/timeoutRedirect');

function identifyPage(req, res) {
  const { identify } = req.body;
  let redirectUrl;
  let route;
  logger.info(`Cookies: ${req.cookies.sessionId}`);

  if (typeof req.cookies.sessionId !== 'undefined') {
    if (identify === 'Yes' || identify === 'No') {
      route = identify === 'Yes' ? 'method-obtained' : 'invalid';
      res.cookie('route', route, {
        httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
      });
      res.redirect(`/${route}`);
    } else {
      res.redirect('/identify');
    }
  } else {
    redirectUrl = hasTimedOut.redirectTimeout('no valid session');
    res.redirect(redirectUrl);
  }
}

module.exports.identify = identifyPage;
