import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import sinon from 'sinon';
import nock from 'nock';

import fitnoteNeeded from '../../../../app/controllers/get/fitnoteNeeded.js';

const { assert } = chai;

chai.use(chaiHttp);

describe('fitnoteNeeded', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
    query: {
      ref: '',
      statusCode: 200,
    },
    body: {},
    language: 'en',
  };
  const fitnoteNeededTemplate = 'fitnote-needed';

  it('should render the fitnoteNeeded page with no-fit-note-needed query ref', (done) => {
    req.query.ref = 'no-fit-note-needed';
    const res = {
      render(template, options) {
        assert.equal(template, fitnoteNeededTemplate);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.previousPageCYA, -1);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
      cookie: sinon.spy(),
      locals: { exp: '', lang: 'en' },
    };
    nock(config.get('api.url'))
      .post('/check-fit-note-needed')
      .reply(200, req.body);
    fitnoteNeeded(req, res);
  });

  it('should render the fitnoteNeeded page with method-obtained query ref', (done) => {
    req.query.ref = 'method-obtained';
    const res = {
      render(template, options) {
        assert.equal(template, fitnoteNeededTemplate);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.previousPageCYA, 1);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
      cookie: sinon.spy(),
      locals: { exp: '', lang: 'en' },
    };
    nock(config.get('api.url'))
      .post('/esa')
      .reply(200, req.body);
    fitnoteNeeded(req, res);
  });

  it('should render the fitnoteNeeded page with no query ref', (done) => {
    delete req.query.ref;
    req.language = 'cy';
    const res = {
      render(template, options) {
        assert.equal(template, fitnoteNeededTemplate);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.previousPageCYA, 0);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
      cookie: sinon.spy(),
      locals: { exp: '', lang: 'en' },
    };
    nock(config.get('api.url'))
      .post('/check-fit-note-needed')
      .reply(200, req.body);
    fitnoteNeeded(req, res);
  });
});
