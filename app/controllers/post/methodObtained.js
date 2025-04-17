import config from 'config';

import hasTimedOut from '../../functions/timeoutRedirect.js';

function methodObtainedPage(req, res) {
  const { methodObtained } = req.body;
  const isValid = methodObtained === 'paper' || methodObtained === 'digital';
  let route;
  let redirectUrl;

  if (typeof req.cookies.sessionId !== 'undefined') {
    if (isValid) {
      route = `guidance-${methodObtained}`;
      res.cookie('route', route, {
        httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
      });
      res.redirect(`/${route}`);
    } else {
      res.redirect('/method-obtained');
    }
  } else {
    redirectUrl = hasTimedOut('no valid session');
    res.redirect(redirectUrl);
  }
}

export default methodObtainedPage;
