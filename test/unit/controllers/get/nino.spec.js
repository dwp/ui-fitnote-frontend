import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import nock from 'nock';
import nino from '../../../../app/controllers/get/nino.js';
import ninoMock from '../../../mocks/ninoMock.js';
import enErrors from '../../../../app/locales/en/errors.json' with { type: 'json' };
import cyErrors from '../../../../app/locales/cy/errors.json' with { type: 'json' };

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
    nino(req, res);
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
    nino(req, res);
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
    nino(req, res);
  });
});
