import config from 'config';

function cookiesDetailsPage(req, res) {
  res.render('cookies-details', {
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

export default cookiesDetailsPage;
