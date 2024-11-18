const { expect } = require('chai');
const sinon = require('sinon');
const net = require('net');
const config = require('config');
const logger = require('../../../app/functions/bunyan');
const { apiCheck } = require('../../../app/functions/checkServer');

describe('checkServer', () => {
  let connectionStub;
  let getEnvStub;
  let loggerInfoStub;
  let loggerErrorStub;
  const uri = 'http://localhost:4567';
  const client = { on: sinon.stub() };

  beforeEach(() => {
    connectionStub = sinon.stub(net, 'connect').callsFake((port, hostname, callback) => {
      callback();
      return client;
    });
    getEnvStub = sinon.stub(config.util, 'getEnv');
    loggerInfoStub = sinon.stub(logger, 'info');
    loggerErrorStub = sinon.stub(logger, 'error');
  });

  afterEach(() => {
    connectionStub.restore();
    getEnvStub.restore();
    loggerInfoStub.restore();
    loggerErrorStub.restore();
  });

  it('should log connected when connection is succesful and environment is not test', () => {
    getEnvStub.returns('development');
    apiCheck(uri);
    expect(loggerInfoStub.calledWith(`API Connected: ${uri}`)).to.be.equal(true);
  });

  it('should not log connected when connection is successful and environment is test', () => {
    getEnvStub.returns('test');
    apiCheck(uri);
    expect(loggerInfoStub.called).to.be.equal(false);
  });

  it('should log error when connect fails and environment is not test', () => {
    getEnvStub.returns('development');
    client.on.withArgs('error').yields(new Error('Connection error'));
    apiCheck(uri);
    expect(loggerErrorStub.calledWith('API Error : Connection error')).to.be.equal(true);
  });

  it('should not log error when connect fails and environment is test', () => {
    getEnvStub.returns('test');
    client.on.withArgs('error').yields(new Error('Connection error'));
    apiCheck(uri);
    expect(loggerErrorStub.called).to.be.equal(false);
  });
});
