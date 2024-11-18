const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const methodObtained = require('../../../../app/controllers/post/methodObtained.js');

const { assert } = chai;
chai.use(chaiHttp);

const req = {
  body: {
    methodObtained: null,
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

describe('Method Obtained (POST)', () => {
  it('Should redirect to /method-obtained when method-obtained is null', (done) => {
    const res = buildRes('/method-obtained', done);
    methodObtained.methodObtained(req, res);
  });

  it('Should redirect to /guidance-paper when method-obtained is paper', (done) => {
    req.body.methodObtained = 'paper';
    const res = buildRes('/guidance-paper', done);
    methodObtained.methodObtained(req, res);
  });

  it('Should redirect to /guidance-digital when method-obtained is digital', (done) => {
    req.body.methodObtained = 'digital';
    const res = buildRes('/guidance-digital', done);
    methodObtained.methodObtained(req, res);
  });
});
