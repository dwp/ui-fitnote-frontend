const chai = require('chai');
const sinon = require('sinon');
const config = require('config');
const { isAuthenticated } = require('../../../app/functions/isAuthenticated');

const { expect } = chai;

describe('isAuthenticated', () => {
  const next = sinon.spy();
  let getEnvStub;

  beforeEach(() => {
    getEnvStub = sinon.stub(config.util, 'getEnv');
  });

  afterEach(() => {
    sinon.resetHistory();
    getEnvStub.restore();
    getEnvStub.resetHistory();
  });

  it('Should return next when not test environment and has sessionId', () => {
    getEnvStub.returns('development');
    const req = {
      language: 'cy',
      cookies: {
        sessionId: 'sessionId',
        exp: 'exp',
      },
    };
    const res = { locals: { } };

    isAuthenticated(req, res, next);

    expect(res.locals.lang).to.be.equal('cy');
    expect(res.locals.exp).to.be.equal('exp');
    expect(next.calledOnce).to.be.equal(true);
  });

  it('Should return next when not test environment and has sessionId and no cookie exp', () => {
    getEnvStub.returns('development');
    const req = {
      language: 'en',
      cookies: {
        sessionId: 'sessionId',
      },
    };
    const res = { locals: { } };

    isAuthenticated(req, res, next);

    expect(res.locals.lang).to.be.equal('en');
    expect(res.locals.exp).to.be.equal(false);
    expect(next.calledOnce).to.be.equal(true);
  });

  it('Should redirect to timed out url when not test environment and does not have sessionId', (done) => {
    getEnvStub.returns('development');
    const req = {
      language: 'en',
      cookies: {},
    };
    const res = {
      redirect(template) {
        expect(template).to.be.equal('/session-timeout');
        done();
      },
    };

    isAuthenticated(req, res, next);
  });

  it('Should return next when test environment', () => {
    getEnvStub.returns('test');
    const req = { };
    const res = { };

    isAuthenticated(req, res, next);
    expect(next.calledOnce).to.be.equal(true);
  });
});
