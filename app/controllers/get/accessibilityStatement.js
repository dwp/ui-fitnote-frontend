const config = require('config');

function accessibilityPage(req, res) {
  res.render('accessibility-statement', {
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

module.exports.accessibilityPage = accessibilityPage;
