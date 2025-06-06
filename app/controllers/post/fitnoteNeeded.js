import config from 'config';
import logger from '../../functions/bunyan.js';
import hasTimedOut from '../../functions/timeoutRedirect.js';

function fitnoteNeededPage(req, res) {
  const { fitnoteNeeded } = req.body;
  let redirectUrl;
  let route;
  logger.info(`Cookies: ${req.cookies.sessionId}`);

  if (typeof req.cookies.sessionId !== 'undefined') {
    if (fitnoteNeeded === 'notSure' || fitnoteNeeded === 'group' || fitnoteNeeded === 'esa') {
      route = fitnoteNeeded === 'notSure' || fitnoteNeeded === 'group' ? 'method-obtained' : 'no-fit-note-needed';

      res.cookie('route', route, {
        httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
      });
      res.redirect(`/${route}`);
    } else {
      res.redirect('/check-fit-note-needed');
    }
  } else {
    redirectUrl = hasTimedOut('no valid session');
    res.redirect(redirectUrl);
  }
}

export default fitnoteNeededPage;
