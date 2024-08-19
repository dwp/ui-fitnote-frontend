const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const sessionTimeout = require('../../../../app/controllers/get/sessionTimeout');

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
    sessionTimeout.sessionTimeout(req, res);
  });
});
