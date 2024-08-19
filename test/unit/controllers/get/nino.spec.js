const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const nock = require('nock');
const nino = require('../../../../app/controllers/get/nino');
const ninoMock = require('../../../mocks/ninoMock');
const enErrors = require('../../../../app/locales/en/errors.json');
const cyErrors = require('../../../../app/locales/cy/errors.json');

const { assert } = chai;
chai.use(chaiHttp);

describe('National insurance Page', () => {
  const { req, body, endPoints } = ninoMock;

  it('should render the nino page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'nino');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.sessionId, req.cookies.sessionId);
        done();
      },
    };
    nock(config.get('api.url'))
      .post(`/${endPoints.queryNino}`)
      .reply(200, body);
    nino.ninoPage(req, res);
  });

  it('should check if the validationErrors content is in english', (done) => {
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(enErrors));
        done();
      },
    };
    nock(config.get('api.url'))
      .post(`/${endPoints.queryNino}`)
      .reply(200, body);
    nino.ninoPage(req, res);
  });

  it('should check if the validationErrors content is in welsh', (done) => {
    req.language = 'cy';
    const res = {
      render(template, options) {
        assert.equal(options.validationErrors, JSON.stringify(cyErrors));
        done();
      },
    };
    nock(config.get('api.url'))
      .post(`/${endPoints.queryNino}`)
      .reply(200, body);
    nino.ninoPage(req, res);
  });
});
