const config = require('config');
const logger = require('../../functions/bunyan');

const hasTimedOut = require('../../functions/timeoutRedirect');

function devicePage(req, res) {
  const deviceRaw = req.body.device;
  const deviceValid = (deviceRaw === 'desktop' || deviceRaw === 'phone');
  let route;
  let redirectUrl;
  logger.info(`Session ID ${req.cookies.sessionId}`);
  if (typeof req.cookies.sessionId !== 'undefined') {
    if (deviceValid) {
      route = (req.body.device === 'desktop') ? 'upload' : 'take';
      res.cookie('route', route, {
        httpOnly: true,
        secure: config.get('cookieOptions.secure'),
        sameSite: true,
        expires: 0,
      });
      res.redirect(`/${route}-a-photo`);
    } else {
      res.redirect('/device?device=0');
    }
  } else {
    redirectUrl = hasTimedOut.redirectTimeout('no valid session');
    res.redirect(redirectUrl);
  }
}

module.exports.device = devicePage;
