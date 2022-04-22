const chai = require('chai');
const chaiHttp = require('chai-http');
const helpForPhotoGet = require('../../../../app/controllers/get/helpForPhoto');

const { assert } = chai;
chai.use(chaiHttp);

describe('Help for Photo', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
      route: 'upload',
    },
  };

  it('should render help-for-photo-1 page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'photo-help/help-for-photo-1');
        assert.equal(options.route, 'upload');
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        assert.equal(options.version, process.env.npm_package_version);
        done();
      },
    };
    helpForPhotoGet.helpForPhotoStep1Page(req, res);
  });

  it('should render help-for-photo-2 page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'photo-help/help-for-photo-2');
        assert.equal(options.route, 'upload');
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        assert.equal(options.version, process.env.npm_package_version);
        done();
      },
    };
    helpForPhotoGet.helpForPhotoStep2Page(req, res);
  });

  it('should render help-for-photo-3 page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'photo-help/help-for-photo-3');
        assert.equal(options.route, 'upload');
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        assert.equal(options.version, process.env.npm_package_version);
        done();
      },
    };
    helpForPhotoGet.helpForPhotoStep3Page(req, res);
  });

  it('should render help-for-photo-4 page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'photo-help/help-for-photo-4');
        assert.equal(options.route, 'upload');
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        assert.equal(options.version, process.env.npm_package_version);
        done();
      },
    };
    helpForPhotoGet.helpForPhotoStep4Page(req, res);
  });

  it('should render help-for-photo-5 page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'photo-help/help-for-photo-5');
        assert.equal(options.route, 'upload');
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        assert.equal(options.version, process.env.npm_package_version);
        done();
      },
    };
    helpForPhotoGet.helpForPhotoStep5Page(req, res);
  });
});
