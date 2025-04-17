import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import sessionTimeout from '../../../../app/controllers/get/sessionTimeout.js';

const { assert } = chai;
chai.use(chaiHttp);

describe('Session Timeout Page', () => {
  const req = {
    cookies: {
      cookies_agreed: true,
    },
    language: 'en',
  };

  it('Should render the Session Timeout page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'errors/session-timeout');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    sessionTimeout(req, res);
  });
});
