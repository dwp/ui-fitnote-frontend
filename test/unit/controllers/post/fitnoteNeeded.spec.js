import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import nock from 'nock';
import sinon from 'sinon';
import fitnoteNeeded from '../../../../app/controllers/post/fitnoteNeeded.js';

const { assert } = chai;
chai.use(chaiHttp);

const req = {
  body: {
    fitnoteNeeded: 'esa',
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

describe('fitnoteNeeded', () => {
  const checkFitnoteNeededRoute = '/check-fit-note-needed';
  nock(config.get('api.url'))
    .post(checkFitnoteNeededRoute)
    .reply(200, req.body);

  it('Should redirect to no-fit-note-needed route when body is esa', (done) => {
    const res = buildRes('/no-fit-note-needed', done);
    fitnoteNeeded(req, res);
  });

  it('Should redirect to method-obtained route when body is notSure', (done) => {
    req.body.fitnoteNeeded = 'notSure';
    const res = buildRes('/method-obtained', done);
    fitnoteNeeded(req, res);
  });

  it('Should redirect to method-obtained route when body is group', (done) => {
    req.body.fitnoteNeeded = 'group';
    const res = buildRes('/method-obtained', done);
    fitnoteNeeded(req, res);
  });

  it('Should redirect to check-fit-note-needed route when esa body is Unknown', (done) => {
    req.body.fitnoteNeeded = 'unknown';
    const res = buildRes(checkFitnoteNeededRoute, done);
    fitnoteNeeded(req, res);
  });

  it('Should redirect to esa route when esa body is undefined', (done) => {
    req.body.fitnoteNeeded = undefined;
    const res = buildRes(checkFitnoteNeededRoute, done);
    fitnoteNeeded(req, res);
  });

  it('Should redirect timed out route when no sessionId in req', (done) => {
    delete req.cookies.sessionId;
    const res = buildRes('/session-timeout', done);
    fitnoteNeeded(req, res);
  });
});
