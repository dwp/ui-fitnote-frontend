const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const sinon = require('sinon');
const index = require('../../../../app/controllers/get/index');
const retry = require('../../../../app/functions/retryCookie');
const logger = require('../../../../app/functions/bunyan');

const { assert } = chai;
chai.use(chaiHttp);

describe('Index Page', () => {
  const req = {};

  it('should call logger info() function and display correct message', () => {
    const res = {
      cookie: sinon.spy(),
      locals: sinon.spy(),
      render: sinon.spy(),
    };

    const loggerSpy = sinon.spy(logger, 'info');
    index.indexPage(req, res);
    assert.equal(loggerSpy.firstCall.firstArg, 'Creating Session ID');
    assert.equal(loggerSpy.called, true);
    loggerSpy.restore();
  });

  it('should call retryCookie() function', () => {
    const res = {
      cookie: sinon.spy(),
      locals: sinon.spy(),
      render: sinon.spy(),
    };

    const retrySpy = sinon.spy(retry, 'retryCookie');
    index.indexPage(req, res);
    assert.equal(retrySpy.called, true);
  });

  it('should render the index page with the correct options', (done) => {
    const res = {
      cookie: sinon.spy(),
      locals: sinon.spy(),
      render(template, options) {
        assert.equal(template, 'index');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    index.indexPage(req, res);
  });
});
