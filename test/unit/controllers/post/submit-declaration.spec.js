import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import nock from 'nock';
import sinon from 'sinon';
import submitDeclaration from '../../../../app/controllers/post/submitDeclaration.js';

const { assert } = chai;
chai.use(chaiHttp);

const req = {
  body: {
    sessionId: '97w1y2guyg1wd555',
    accepted: true,
  },
  cookies: {
    sessionId: '97w1y2guyg1wd555',
    cookies_agreed: true,
  },
  language: 'en',
};

function buildRes(expectedRedirect, done) {
  return {
    status: () => ({
      render: () => {},
      redirect: (template) => {
        assert.equal(template, expectedRedirect);
        done();
      },
    }),
    redirect(template) {
      assert.equal(template, expectedRedirect);
      done();
    },
    cookie: sinon.spy(),
  };
}

const declaration = '/declaration';

describe('Submit Declaration (POST)', () => {
  it('Submit declaration and redirect to /complete (200)', (done) => {
    nock(config.get('api.url'))
      .post(declaration)
      .reply(200, req.body);
    const res = buildRes('/complete', done);
    submitDeclaration(req, res);
  });

  it('Submit declaration and redirect to /complete (201)', (done) => {
    nock(config.get('api.url'))
      .post(declaration)
      .reply(201, req.body);
    const res = buildRes('/complete', done);
    submitDeclaration(req, res);
  });

  it('Submit declaration API responds with 400 and redirect to /500 ', (done) => {
    nock(config.get('api.url'))
      .post(declaration)
      .reply(400, {});
    const res = buildRes('/500', done);
    submitDeclaration(req, res);
  });

  it('Submit declaration API responds with 429 and redirect to /500 ', (done) => {
    nock(config.get('api.url'))
      .post(declaration)
      .reply(429, {});
    const res = buildRes('/500', done);
    submitDeclaration(req, res);
  });

  it('Submit declaration API responds with error and redirect to /500 ', (done) => {
    nock(config.get('api.url'))
      .post(declaration)
      .replyWithError('API failure');
    const res = buildRes('/500', done);
    submitDeclaration(req, res);
  });

  it('Submit declaration and redirect to /session-timeout', (done) => {
    req.cookies.sessionId = undefined; // No SessionId
    const res = buildRes('/session-timeout', done);
    submitDeclaration(req, res);
  });
});
