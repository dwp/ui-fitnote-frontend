import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import nock from 'nock';
import sinon from 'sinon';
import esa from '../../../../app/controllers/post/esa.js';

const { assert } = chai;
chai.use(chaiHttp);

const req = {
  body: {
    esa: 'Yes',
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
    .post('/esa')
    .reply(200, req.body);

  it('Should redirect to method-obtained route when body is Yes', (done) => {
    const res = buildRes('/method-obtained', done);
    esa(req, res);
  });

  it('Should redirect to no-esa route when body is No', (done) => {
    req.body.esa = 'No';
    const res = buildRes('/no-esa', done);
    esa(req, res);
  });

  it('Should redirect to esa route when esa body is Unknown', (done) => {
    req.body.esa = 'unknown';
    const res = buildRes('/esa', done);
    esa(req, res);
  });

  it('Should redirect to esa route when esa body is undefined', (done) => {
    req.body.esa = undefined;
    const res = buildRes('/esa', done);
    esa(req, res);
  });

  it('Should redirect timed out route when no sessionId in req', (done) => {
    delete req.cookies.sessionId;
    const res = buildRes('/session-timeout', done);
    esa(req, res);
  });
});
