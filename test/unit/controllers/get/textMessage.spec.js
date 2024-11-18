const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const nock = require('nock');
const sinon = require('sinon');
const textMessage = require('../../../../app/controllers/get/textMessage');

const { assert } = chai;
chai.use(chaiHttp);

describe('Text Message Page', () => {
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
    i18nTranslator: {
      t: sinon.spy(),
    },
  };

  afterEach(() => {
    sinon.reset();
  });

  const textMsg = 'text-message';
  const queryMobile = '/queryMobile';

  it('Should render the Text Message page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, textMsg);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.previousPageCYA, 0);
        done();
      },
    };
    nock(config.get('api.url'))
      .post(queryMobile)
      .reply(200, req.body);
    textMessage.textMessagePage(req, res);
  });

  it('Should render the Text Message page with missing text message error', (done) => {
    req.language = 'cy';
    req.query.text = '0';
    req.query.ref = 'check-your-answers';

    const res = {
      render(template, options) {
        assert.equal(req.i18nTranslator.t.calledWith('errors:text-message.missing'), true);
        assert.equal(template, textMsg);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.errors.radioMessage.field, 'mobileNumberID');
        assert.equal(options.previousPageCYA, 1);
        done();
      },
    };
    nock(config.get('api.url'))
      .post(queryMobile)
      .reply(200, req);
    textMessage.textMessagePage(req, res);
  });

  it('Should render the Text Message page with mobile error', (done) => {
    req.query.text = '1';
    delete req.query.ref;
    const res = {
      render(template, options) {
        assert.equal(req.i18nTranslator.t.calledWith('errors:text-message.mobile'), true);
        assert.equal(template, textMsg);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.errors.textMessageMobile.field, 'mobileNumberID');
        done();
      },
    };
    nock(config.get('api.url'))
      .post(queryMobile)
      .reply(200, req);
    textMessage.textMessagePage(req, res);
  });

  it('Should render the Text Message page with format error', (done) => {
    req.query.text = '2';
    const res = {
      render(template, options) {
        assert.equal(req.i18nTranslator.t.calledWith('errors:text-message.format'), true);
        assert.equal(template, textMsg);
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        assert.equal(options.errors.textMessageFormat.field, 'mobileNumberID');
        done();
      },
    };
    nock(config.get('api.url'))
      .post(queryMobile)
      .reply(200, req);
    textMessage.textMessagePage(req, res);
  });

  it('Should render errors/500 page when response is not 200', (done) => {
    const res = {
      render(template) {
        assert.equal(template, 'errors/500');
        done();
      },
    };
    nock(config.get('api.url'))
      .post(queryMobile)
      .reply(500, req);
    textMessage.textMessagePage(req, res);
  });
});
