const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const nock = require('nock');
const sinon = require('sinon');
const sendNino = require('../../../../app/controllers/post/sendNino.js');
const ninoMock = require('../../../mocks/ninoMock');

const { assert } = chai;
chai.use(chaiHttp);

const { req, body, endPoints } = ninoMock;

req.body.ninoField = 'AA370773A';

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

describe('Send Nino (POST)', () => {
  nock(config.get('api.url'))
    .post(`/${endPoints.nino}`)
    .reply(200, body);

  it('Send NINO to post controller and redirect to address', (done) => {
    const res = buildRes('/address', done);
    sendNino.sendNino(req, res);
  });

  it('Send invalid NINO to post controller and redirect to nino?nino=1', (done) => {
    const res = buildRes('nino?nino=1', done);
    req.body.ninoField = 'AA1234'; // Invalid NINO
    sendNino.sendNino(req, res);
  });

  it('Send no NINO to post controller and redirect to nino?nino=0', (done) => {
    const res = buildRes('nino?nino=0', done);
    req.body.ninoField = ''; // No NINO
    sendNino.sendNino(req, res);
  });

  it('Send no SessionId to post controller send to /session-timeout', (done) => {
    const res = buildRes('/session-timeout', done);
    req.body.ninoField = 'AA370773A';
    req.cookies.sessionId = undefined; // No SessionId
    sendNino.sendNino(req, res);
  });
});