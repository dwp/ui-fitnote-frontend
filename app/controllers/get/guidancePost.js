import config from 'config';

function guidancePostPage(req, res) {
  const route = 'guidance-post';

  res.render(route, {
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    environment: config.util.getEnv('NODE_ENV'),
    timeStamp: Date.now(),
    route,
  });
}

export default guidancePostPage;
