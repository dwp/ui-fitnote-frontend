/* eslint-disable global-require */
import { expect } from 'chai';
import sinon from 'sinon';
import config from 'config';
import bunyan from 'bunyan';
import bsyslog from 'bunyan-syslog-udp';
import logger from '../../../app/functions/bunyan.js';

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

    const testLogger = logger;

    expect(testLogger.streams.length).to.be.equal(1);
  });

  it('should create logger with syslog stream without config provided', () => {
    config.get.returns({ });

    createBunyanStreamStub.returns({});

    const testLogger = logger;

    expect(testLogger.streams.length).to.be.equal(1);
  });

  it('should create logger for test environment', () => {
    config.get.returns({});
    config.nodeEnvironment = 'test';

    createBunyanStreamStub.returns({});

    const testLogger = logger;

    expect(testLogger.streams.length).to.be.equal(1);
  });
});
