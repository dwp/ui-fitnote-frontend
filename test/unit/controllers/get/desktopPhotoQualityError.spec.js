const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const sinon = require('sinon');
const desktopPhotoQuality = require('../../../../app/controllers/get/desktopPhotoQualityError');

const { assert } = chai;
chai.use(chaiHttp);

describe('Desktop Photo Quality Error', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
  };

  it('should render errors/422-desktop template with correct options', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'errors/422-desktop');
        assert.equal(options.title, '422 : Photo quality error');
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
      status: sinon.spy(),
    };
    desktopPhotoQuality.desktopPhotoQualityError(req, res);
    assert.equal(res.clearCookie.firstCall.args[0], '422');
  });
});
