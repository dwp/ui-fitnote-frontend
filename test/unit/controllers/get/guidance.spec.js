const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const guidance = require('../../../../app/controllers/get/guidance');

const { assert } = chai;

chai.use(chaiHttp);

describe('Guidance Page', () => {
  const dateNow = new Date();
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      exp: dateNow,
      retry: '1',
      cookies_agreed: true,
    },
  };

  const digitalTemplate = 'guidance-digital';
  const paperTemplate = 'guidance-paper';

  it('load guidance digital page after visiting upload page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, digitalTemplate);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        done();
      },
    };
    req.cookies.route = 'upload-digital';
    guidance.guidance(req, res);
  });

  it('load guidance paper page after visiting upload page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, paperTemplate);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        done();
      },
    };
    req.cookies.route = 'upload-paper';
    guidance.guidance(req, res);
  });

  it('load guidance paper page after visiting method obtained', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, paperTemplate);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        done();
      },
    };
    req.cookies.route = paperTemplate;
    guidance.guidance(req, res);
  });

  it('load guidance digital page after visiting method obtained', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, digitalTemplate);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        done();
      },
    };
    req.cookies.route = digitalTemplate;
    guidance.guidance(req, res);
  });

  it('should redirect to esa page if no route cookie', (done) => {
    req.cookies.route = undefined;
    const res = {
      redirect(url) {
        assert.equal(url, '/');
        done();
      },
    };
    guidance.guidance(req, res);
  });

  it('should redirect to ESA page if route cookie is set to method-obtained', (done) => {
    req.cookies.route = 'method-obtained';
    const res = {
      redirect(url) {
        assert.equal(url, '/');
        done();
      },
    };
    guidance.guidance(req, res);
  });
});
