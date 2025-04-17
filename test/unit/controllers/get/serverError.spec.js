import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';

import serverError from '../../../../app/controllers/get/serverError.js';

const { assert } = chai;

chai.use(chaiHttp);

describe('serverError', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
    body: {},
    language: 'en',
  };

  it('should render the serverError page', (done) => {
    const res = {
      status(errorStatus) {
        assert.equal(errorStatus, 500);
      },
      render(template, options) {
        assert.equal(template, 'errors/500');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    serverError(req, res);
  });

  it('should render the serverError page for test env', (done) => {
    config.nodeEnvironment = 'test';

    const res = {
      status(errorStatus) {
        assert.equal(errorStatus, 500);
      },
      render(template, options) {
        assert.equal(template, 'errors/500');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    serverError(req, res);
  });
});
