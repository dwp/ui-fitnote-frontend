import config from 'config';

function noFitnoteNeededPage(req, res) {
  res.render('no-fitnote-needed', {
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

export default noFitnoteNeededPage;
