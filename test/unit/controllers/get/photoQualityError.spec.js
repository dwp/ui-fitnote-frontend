import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import config from 'config';
import photoQualityError from '../../../../app/controllers/get/photoQualityError.js';

const { assert } = chai;
chai.use(chaiHttp);

describe('Photo Quality Error Page', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
    language: 'en',
  };

  it('Should render the Photo Quality Error page (422)', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'errors/422');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
      status: sinon.spy(),
    };
    photoQualityError(req, res);
    assert.equal(res.clearCookie.firstCall.args[0], '422');
  });
});
