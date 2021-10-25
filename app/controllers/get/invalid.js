const config = require('config');

function invalidPage(req, res) {
  res.render('invalid', {
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

module.exports.invalid = invalidPage;
