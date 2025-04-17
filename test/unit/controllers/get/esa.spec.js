import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import sinon from 'sinon';
import nock from 'nock';

import esa from '../../../../app/controllers/get/esa.js';

const { assert } = chai;

chai.use(chaiHttp);

describe('esa', () => {
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

  
  it('should render the esa page with no-esa query ref', (done) => {
    req.query.ref = 'no-esa';
    const res = {
      render(template, options) {
        assert.equal(template, 'esa');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.previousPageCYA, -1);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
      cookie: sinon.spy(),
      locals: { exp: '', lang: 'en' },
    };
    nock(config.get('api.url'))
      .post('/esa')
      .reply(200, req.body);
    esa(req, res);
  });

  it('should render the esa page with method-obtained query ref', (done) => {
    req.query.ref = 'method-obtained';
    const res = {
      render(template, options) {
        assert.equal(template, 'esa');
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
    esa(req, res);
  });

  it('should render the esa page with no query ref', (done) => {
    delete req.query.ref;
    req.language = 'cy';
    const res = {
      render(template, options) {
        assert.equal(template, 'esa');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.previousPageCYA, 0);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
      cookie: sinon.spy(),
      locals: { exp: '', lang: 'en' },
    };
    nock(config.get('api.url'))
      .post('/esa')
      .reply(200, req.body);
    esa(req, res);
  });
});
