import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import nock from 'nock';
import sinon from 'sinon';
import sendTextMessage from '../../../../app/controllers/post/sendTextMessage.js';

const { assert } = chai;
chai.use(chaiHttp);

const req = {
  body: {
    textReminder: 'Yes',
    mobileNumberField: '07877654321',
  },
  cookies: {
    sessionId: '97w1y2guyg1wd555',
    cookies_agreed: true,
  },
  query: {
    ref: 'address',
    statusCode: 200,
  },
  language: 'en',
};

function buildRes(expectedRedirect, done) {
  return {
    redirect(template) {
      assert.equal(template, expectedRedirect);
      done();
    },
    status: () => ({
      render: () => {},
      redirect: () => {},
    }),
    cookie: sinon.spy(),
  };
}

describe('Send text message (POST)', () => {
  nock(config.get('api.url'))
    .post('/mobile')
    .reply(200, req.body);

  it('Send text message number and redirect to check-your-answers', (done) => {
    const res = buildRes('/check-your-answers', done);
    sendTextMessage(req, res);
  });

  it('Send blank text message number and redirect to /text-message?text=1', (done) => {
    req.body.mobileNumberField = ''; // Blank number
    const res = buildRes('/text-message?text=1', done);
    sendTextMessage(req, res);
  });

  it('Send invalid text message number and redirect to /text-message?text=2', (done) => {
    req.body.mobileNumberField = 'abc123'; // Invalid number
    const res = buildRes('/text-message?text=2', done());
    sendTextMessage(req, res);
  });

  it('Send text message number with no sessionId and redirect to /session-timeout', (done) => {
    req.cookies.sessionId = undefined; // No SessionId
    const res = buildRes('/session-timeout', done());
    sendTextMessage(req, res);
  });
});
