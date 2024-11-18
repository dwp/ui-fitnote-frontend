const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const sinon = require('sinon');
const takePhoto = require('../../../../app/controllers/get/takePhoto');

const { assert } = chai;
chai.use(chaiHttp);

describe('Take Photo Page (upload)', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
    query: {
      ref: 'digital',
    },
    i18nTranslator: {
      t: sinon.spy(),
    },
    language: 'en',
  };

  afterEach(() => {
    sinon.reset();
  });

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

  it('Should render the upload page with file, size and type errors', (done) => {
    req.query.type = '2';
    req.query.size = '2';
    req.query.ref = 'manual';
    const res = {
      render(template, options) {
        assert.equal(options.fileError, true);
        assert.equal(options.typeError, true);
        assert.equal(req.i18nTranslator.t.calledWith('upload:tooBig'), true);
        assert.equal(options.previousPageCYA, 0);
        assert.equal(template, 'upload');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    takePhoto.takePhotoPage(req, res);
  });

  it('Should render the upload page with photo errors (service failed)', (done) => {
    delete req.query.type;
    delete req.query.ref;
    req.query.error = 'serviceFailed';
    const res = {
      render(template, options) {
        assert.equal(req.i18nTranslator.t.calledWith('upload:serviceFail'), true);
        assert.equal(template, 'upload');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    takePhoto.takePhotoPage(req, res);
  });

  it('Should render the upload page with photo errors (no photo)', (done) => {
    delete req.query.type;
    delete req.query.ref;
    req.query.error = 'noPhoto';
    const res = {
      render(template, options) {
        assert.equal(req.i18nTranslator.t.calledWith('upload:missing'), true);
        assert.equal(template, 'upload');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    takePhoto.takePhotoPage(req, res);
  });

  it('Should render the upload page with photo errors (ocr failed)', (done) => {
    delete req.query.type;
    delete req.query.ref;
    req.query.error = 'ocrFailed';
    const res = {
      cookie: sinon.spy(),
      render(template, options) {
        assert.equal(req.i18nTranslator.t.calledWith('upload:failed-ocr'), true);
        assert.equal(template, 'upload');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    takePhoto.takePhotoPage(req, res);
  });

  it('Should render the upload page with photo errors (max replay)', (done) => {
    delete req.query.type;
    delete req.query.ref;
    req.query.error = 'maxReplay';
    const res = {
      render(template, options) {
        assert.equal(req.i18nTranslator.t.calledWith('upload:maxReplay'), true);
        assert.equal(template, 'upload');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    takePhoto.takePhotoPage(req, res);
  });
});
