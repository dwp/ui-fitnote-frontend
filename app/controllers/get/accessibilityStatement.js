import config from 'config';

function accessibilityPage(req, res) {
  res.render('accessibility-statement', {
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

export default accessibilityPage;
