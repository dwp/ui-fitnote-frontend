const config = require('config');

function guidancePage(req, res) {
  const validCookie = {
    'upload-digital': 'guidance-digital',
    'guidance-digital': 'guidance-digital',
    'upload-paper': 'guidance-paper',
    'guidance-paper': 'guidance-paper',
  };
  const route = validCookie[req.cookies.route];
  if (typeof route === 'undefined') {
    res.redirect('/');
    return;
  }

  const page = route;
  res.render(page, {
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    environment: config.util.getEnv('NODE_ENV'),
    timeStamp: Date.now(),
    route,
  });
}

module.exports.guidance = guidancePage;
