import config from 'config';
import logger from '../../functions/bunyan.js';
import hasTimedOut from '../../functions/timeoutRedirect.js';

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
    redirectUrl = hasTimedOut('no valid session');
    res.redirect(redirectUrl);
  }
}

export default esaPage;
