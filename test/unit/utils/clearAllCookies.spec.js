const { expect } = require('chai');
const sinon = require('sinon');
const config = require('config');
const { clearAllCookies } = require('../../../app/functions/utils/clearAllCookies');

describe('clearAllCookies', () => {
  const res = {
    clearCookie: sinon.stub(),
  };
  let getStub;

  beforeEach(() => {
    getStub = sinon.stub(config, 'get');
  });

  afterEach(() => {
    getStub.restore();
    sinon.resetHistory();
  });

  it('should not clear required cookies', () => {
    const req = {
      cookies: {
        sessionId: '123',
        exp: 'exp',
        route: 'route',
        cookies_agreed: 'true',
      },
    };

    clearAllCookies(req, res);
    expect(res.clearCookie.calledWith('sessionId')).to.be.equal(false);
    expect(res.clearCookie.calledWith('exp')).to.be.equal(false);
    expect(res.clearCookie.calledWith('route')).to.be.equal(false);
    expect(res.clearCookie.calledWith('cookies_agreed')).to.be.equal(false);
  });

  it('should clear optional cookies and not required cookies', () => {
    getStub.returns('gtm.domain');

    const req = {
      cookies: {
        sessionId: '123',
        _ga: 'ga',
        _gid: 'gid',
        opt: 'opt',
      },
    };

    clearAllCookies(req, res);
    expect(res.clearCookie.calledWith('sessionId')).to.be.equal(false);
    expect(res.clearCookie.calledWith('_ga')).to.be.equal(true);
    expect(res.clearCookie.calledWith('_gid')).to.be.equal(true);
    expect(res.clearCookie.calledWith('opt')).to.be.equal(true);
  });
});
