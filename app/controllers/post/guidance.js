import config from 'config';
import hasTimedOut from '../../functions/timeoutRedirect.js';

function guidancePage(req, res) {
  const { page } = req.body;
  let route; let
    redirectUrl;

  if (typeof req.cookies.sessionId !== 'undefined') {
    route = 'upload';
    res.cookie('route', `${route}-${page}`, {
      httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
    });
    res.redirect(`/${route}?ref=${page}`);
  } else {
    redirectUrl = hasTimedOut('no valid session');
    res.redirect(redirectUrl);
  }
}

export default guidancePage;
