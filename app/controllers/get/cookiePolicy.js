import config from 'config';

function cookiePolicyPage(req, res) {
  res.render('cookie-policy', {
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

export default cookiePolicyPage;
