const { expect } = require('chai');
const sinon = require('sinon');
const config = require('config');
const { retryCookie } = require('../../../app/functions/retryCookie');

describe('retryCookie', () => {
  let getStub;

  beforeEach(() => {
    getStub = sinon.stub(config, 'get');
  });

  afterEach(() => {
    getStub.restore();
    sinon.resetHistory();
  });

  it('should return true and retry cookie', () => {
    getStub.returns(true);

    const req = {};
    const res = {
      cookie: sinon.stub(),
    };
    const result = retryCookie(req, res);

    expect(res.cookie.calledOnceWithExactly(
      'retry',
      '1',
      {
        httpOnly: true, secure: true, sameSite: true, expires: 0,
      },
    )).to.be.equal(true);
    expect(result).to.be.equal(true);
  });
});