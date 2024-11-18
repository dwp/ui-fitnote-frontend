const { expect } = require('chai');
const sinon = require('sinon');
const config = require('config');
const logger = require('../../../app/functions/bunyan');
const { refreshTime } = require('../../../app/functions/refreshSessionExpiryTime');

describe('refreshSessionExpiryTime', () => {
  const logType = logger.child({ widget: 'test' });
  let getStub;

  beforeEach(() => {
    getStub = sinon.stub(config, 'get');
  });

  afterEach(() => {
    getStub.restore();
    sinon.resetHistory();
  });

  it('should return true and retry cookie', () => {
    getStub.withArgs('sessionInfo.expiryPeriod').returns(1);
    getStub.withArgs('cookieOptions.secure').returns(true);
    const expectedExpires = new Date(Date.now() + 1).toUTCString();
    const res = {
      cookie: sinon.stub(),
    };

    refreshTime(res, logType);

    expect(res.cookie.calledOnceWithExactly(
      'exp',
      expectedExpires,
      {
        httpOnly: true, secure: true, sameSite: true, expires: 0,
      },
    )).to.be.equal(true);
  });
});
