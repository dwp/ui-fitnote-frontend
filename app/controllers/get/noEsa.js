const config = require('config');

function noEsaPage(req, res) {
  res.render('no-esa', {
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

module.exports.noEsa = noEsaPage;
