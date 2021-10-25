const config = require('config');

function cookiesTablePage(req, res) {
  res.render('cookies-table', {
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

module.exports.cookiesTablePage = cookiesTablePage;
