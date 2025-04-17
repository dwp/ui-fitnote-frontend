import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import nock from 'nock';
import sinon from 'sinon';
import sendAddress from '../../../../app/controllers/post/sendAddress.js';

const { assert } = chai;
chai.use(chaiHttp);

const req = {
  body: {
    houseNumberField: '221b',
    postcodeField: 'NW1 6XE',
  },
  cookies: {
    sessionId: '97w1y2guyg1wd555',
    cookies_agreed: true,
  },
  query: {
    ref: 'nino',
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

describe('Send Address (POST)', () => {
  nock(config.get('api.url'))
    .post('/address')
    .reply(200, req.body);

  it('Send Address and redirect to text-message', (done) => {
    const res = buildRes('/text-message', done);
    sendAddress(req, res);
  });

  it('Send INVALID address and redirect to address?houseNumber=1&postcode=0', (done) => {
    req.body.postcodeField = 'abcd'; // Invalid postcode
    const res = buildRes('address?houseNumber=1&postcode=0', done);
    sendAddress(req, res);
  });

  it('Send INVALID address and redirect to address?houseNumber=0&postcode=1', (done) => {
    req.body.houseNumberField = ''; // Invalid house number
    req.body.postcodeField = 'NW1 6XE';
    const res = buildRes('address?houseNumber=0&postcode=1', done);
    sendAddress(req, res);
  });

  it('Send address and redirect to /session-timeout', (done) => {
    req.cookies.sessionId = undefined; // No SessionId
    const res = buildRes('/session-timeout', done);
    sendAddress(req, res);
  });
});
