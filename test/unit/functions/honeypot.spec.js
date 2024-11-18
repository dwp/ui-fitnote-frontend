const { expect } = require('chai');
const sinon = require('sinon');
const logger = require('../../../app/functions/bunyan');
const { honeypot } = require('../../../app/functions/honeypot');

describe('honeypot', () => {
  let loggerInfoStub;

  beforeEach(() => {
    loggerInfoStub = sinon.stub(logger, 'info');
  });

  afterEach(() => {
    loggerInfoStub.restore();
  });

  it('should return true when honeypot called with no field', () => {
    const nullField = null;
    const message = '';
    const result = honeypot(nullField, message);
    expect(result).to.be.equal(true);
    expect(loggerInfoStub.called).to.be.equal(false);
  });

  it('should return false when honeypot called with field', () => {
    const field = 'landline';
    const message = 'BOT: honeypot detected a bot, Text Message Page, Landline Field';
    const result = honeypot(field, message);
    expect(result).to.be.equal(false);
    expect(loggerInfoStub.calledWith(message)).to.be.equal(true);
  });
});
