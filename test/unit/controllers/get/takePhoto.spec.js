const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const takePhoto = require('../../../../app/controllers/get/takePhoto');

const { assert } = chai;
chai.use(chaiHttp);

describe('Take Photo Page (upload)', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
    query: { ref: 'digital' },
    language: 'en',
  };

  it('Should render the upload page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'upload');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    takePhoto.takePhotoPage(req, res);
  });
});
