import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import methodObtainedPage from '../../../../app/controllers/get/methodObtained.js';
import enErrors from '../../../../app/locales/en/errors.json' with { type: 'json' };
import cyErrors from '../../../../app/locales/cy/errors.json' with { type: 'json' };

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

    methodObtainedPage(req, res);
  });

  it('should check if the validationErrors content is in english', () => {
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(enErrors));
      },
    };
    methodObtainedPage(req, res);
  });

  it('should check if the validationErrors content is in welsh', () => {
    req.language = 'cy';
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(cyErrors));
      },
    };
    methodObtainedPage(req, res);
  });

  it('should check if the validationErrors content is in welsh', () => {
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(cyErrors));
      },
    };
    methodObtainedPage(req, res);
  });

  it('should check if the query.ref is guidance-digital', () => {
    const res = {
      render(template, options) {
        assert.equal(options.previousPageCYA, '1');
      },
    };
    methodObtainedPage(req, res);
  });

  it('should check if the query.ref is guidance-paper', () => {
    req.query.ref = 'guidance-paper';
    const res = {
      render(template, options) {
        assert.equal(options.previousPageCYA, '2');
      },
    };
    methodObtainedPage(req, res);
  });
});
