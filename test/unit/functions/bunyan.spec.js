/* eslint-disable global-require */
const { expect } = require('chai');
const sinon = require('sinon');
const config = require('config');
const bunyan = require('bunyan');
const bsyslog = require('bunyan-syslog-udp');

describe('logger', () => {
  let createLoggerStub;
  let createBunyanStreamStub;
  let getStub;

  beforeEach(() => {
    getStub = sinon.stub(config, 'get');
    createLoggerStub = sinon.stub(bunyan, 'createLogger');
    createBunyanStreamStub = sinon.stub(bsyslog, 'createBunyanStream');
  });

  afterEach(() => {
    getStub.restore();
    createLoggerStub.restore();
    createBunyanStreamStub.restore();
    sinon.reset();
    sinon.resetHistory();
  });

  it('should create logger with syslog stream when config is provided', () => {
    config.get.returns({
      host: 'localhost',
      name: 'loger-test',
      port: 3000,
      tag: 'logger-tag',
    });

    createBunyanStreamStub.returns({});

    const logger = require('../../../app/functions/bunyan');
    const testLogger = logger;

    expect(testLogger.streams.length).to.be.equal(1);
  });

  it('should create logger with syslog stream without config provided', () => {
    config.get.returns({ });

    createBunyanStreamStub.returns({});

    const logger = require('../../../app/functions/bunyan');
    const testLogger = logger;

    expect(testLogger.streams.length).to.be.equal(1);
  });

  it('should create logger for test environment', () => {
    config.get.returns({});
    config.nodeEnvironment = 'test';

    createBunyanStreamStub.returns({});

    const logger = require('../../../app/functions/bunyan');
    const testLogger = logger;

    expect(testLogger.streams.length).to.be.equal(1);
  });
});
