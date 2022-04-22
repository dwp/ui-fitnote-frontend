const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const sinon = require('sinon');
const logger = require('../../../../app/functions/bunyan');
const devicePage = require('../../../../app/controllers/get/device');
const enErrors = require('../../../../app/locales/en/errors.json');
const cyErrors = require('../../../../app/locales/cy/errors.json');

const { assert } = chai;
chai.use(chaiHttp);

describe('Device', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
    },
    query: { device: '0' },
    language: 'en',
    i18nTranslator: { t: sinon.spy() },
  };

  it('should render device page with correct options', () => {
    const res = {
      render(template, options) {
        assert.equal(template, 'device');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.sessionId, '97w1y2guyg1wd555');
      },
    };
    const loggerSpy = sinon.spy(logger, 'info');
    devicePage.device(req, res);
    assert.equal(loggerSpy.called, true);
    loggerSpy.restore();
  });

  it('should check if the validationErrors content is in english', () => {
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(enErrors));
      },
    };
    devicePage.device(req, res);
  });

  it('should check if the validationErrors content is in welsh', () => {
    req.language = 'cy';
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(cyErrors));
      },
    };
    devicePage.device(req, res);
  });

  it('should check if errorMessage is set', () => {
    if (req.query.device === '0') {
      const res = {
        render(template, options) {
          assert.equal(options.errors.device.field, 'radioPhone');
        },
      };
      devicePage.device(req, res);
    }
  });
});
