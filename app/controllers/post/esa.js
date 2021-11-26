const config = require('config');
const logger = require('../../functions/bunyan');
const hasTimedOut = require('../../functions/timeoutRedirect');

function esaPage(req, res) {
  const { esa } = req.body;
  let redirectUrl;
  let route;
  logger.info(`Cookies: ${req.cookies.sessionId}`);

  if (typeof req.cookies.sessionId !== 'undefined') {
    if (esa === 'Yes' || esa === 'No') {
      route = esa === 'Yes' ? 'method-obtained' : 'no-esa';
      res.cookie('route', route, {
        httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
      });
      res.redirect(`/${route}`);
    } else {
      res.redirect('/esa');
    }
  } else {
    redirectUrl = hasTimedOut.redirectTimeout('no valid session');
    res.redirect(redirectUrl);
  }
}

module.exports.esa = esaPage;
