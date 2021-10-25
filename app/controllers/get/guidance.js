const config = require('config');

function guidancePage(req, res) {
  let route;

  if (typeof req.cookies.route !== 'undefined') {
    if (req.cookies.route === 'upload-digital') {
      route = 'guidance-digital';
    } else if (req.cookies.route === 'upload-paper') {
      route = 'guidance-paper';
    } else {
      route = req.cookies.route;
    }
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
