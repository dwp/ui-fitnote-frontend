const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const methodObtainedPage = require('../../../../app/controllers/get/methodObtained');
const enErrors = require('../../../../app/locales/en/errors.json');
const cyErrors = require('../../../../app/locales/cy/errors.json');

const { assert } = chai;
chai.use(chaiHttp);

describe('Method Obtained', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
    },
    query: { ref: 'guidance-digital' },
    language: 'en',
  };

  it('should render method obtained page', () => {
    const res = {
      render(template, options) {
        assert.equal(template, 'method-obtained');
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
      },
    };

    methodObtainedPage.methodObtained(req, res);
  });

  it('should check if the validationErrors content is in english', () => {
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(enErrors));
      },
    };
    methodObtainedPage.methodObtained(req, res);
  });

  it('should check if the validationErrors content is in welsh', () => {
    req.language = 'cy';
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(cyErrors));
      },
    };
    methodObtainedPage.methodObtained(req, res);
  });

  it('should check if the validationErrors content is in welsh', () => {
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(cyErrors));
      },
    };
    methodObtainedPage.methodObtained(req, res);
  });

  it('should check if the query.ref is guidance-digital', () => {
    const res = {
      render(template, options) {
        assert.equal(options.previousPageCYA, '1');
      },
    };
    methodObtainedPage.methodObtained(req, res);
  });

  it('should check if the query.ref is guidance-paper', () => {
    req.query.ref = 'guidance-paper';
    const res = {
      render(template, options) {
        assert.equal(options.previousPageCYA, '2');
      },
    };
    methodObtainedPage.methodObtained(req, res);
  });
});
