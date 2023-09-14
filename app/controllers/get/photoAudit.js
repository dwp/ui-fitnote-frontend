const config = require('config');

function photoAuditPage(req, res) {
  const route = 'photo-audit';
  // render has to be in the request. The Nunjucks tag is dependant on the result.
  res.render('photo-audit', {
    checkStatusDelay: config.get('service.checkStatusDelay'),
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
    route,
  });
}

module.exports.photoAuditPage = photoAuditPage;
