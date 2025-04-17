import config from 'config';

function sessionTimeout(req, res) {
  res.render('errors/session-timeout', {
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
    sessionId: req.cookies.sessionId,
  });

  // Make sure the cookies are cleared AFTER page render,
  // so GA can get values, but cleared for security
  res.clearCookie('sessionId');
  res.clearCookie('retry');
}

export default sessionTimeout;
