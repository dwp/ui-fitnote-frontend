import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import sinon from 'sinon';
import complete from '../../../../app/controllers/get/complete.js';

const { assert } = chai;

chai.use(chaiHttp);

describe('Complete Page', () => {
  const dateNow = new Date();
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      exp: dateNow,
      retry: '1',
      cookies_agreed: true,
    },
  };

  it('should call completePage() successfully with the correct params', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'complete');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        done();
      },
    };
    complete(req, res);
  });

  it('should call clearCookie() three times with args: sessionId, exp and retry', () => {
    const res = {
      render(template) {
        assert.equal(template, 'complete');
      },
      clearCookie: sinon.spy(),
    };

    complete(req, res);
    assert.equal(res.clearCookie.callCount, 3);
    assert.equal(res.clearCookie.firstCall.args[0], 'sessionId');
    assert.equal(res.clearCookie.secondCall.args[0], 'exp');
    assert.equal(res.clearCookie.thirdCall.args[0], 'retry');
  });
});
