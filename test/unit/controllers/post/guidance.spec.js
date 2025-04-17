import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import nock from 'nock';
import sinon from 'sinon';
import guidance from '../../../../app/controllers/post/guidance.js';

const { assert } = chai;
chai.use(chaiHttp);

const req = {
  body: {
    page: 'esa',
  },
  cookies: {
    sessionId: '97w1y2guyg1wd555',
    cookies_agreed: true,
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

describe('esa', () => {
  nock(config.get('api.url'))
    .post('/guidance')
    .reply(200, req.body);

  it('Should redirect to upload route with ref when body is populated', (done) => {
    const res = buildRes('/upload?ref=esa', done);
    guidance(req, res);
  });

  it('Should redirect timed out route when no sessionId in req', (done) => {
    delete req.cookies.sessionId;
    const res = buildRes('/session-timeout', done);
    guidance(req, res);
  });
});
