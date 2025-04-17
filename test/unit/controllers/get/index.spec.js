import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import sinon from 'sinon';
import index from '../../../../app/controllers/get/index.js';
import logger from '../../../../app/functions/bunyan.js';

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
    index(req, res);
    assert.equal(loggerSpy.firstCall.firstArg, 'Creating Session ID');
    assert.equal(loggerSpy.called, true);
    loggerSpy.restore();
  });

  it('should call retryCookie() function', () => {
    const res = {
      cookie: sinon.stub(),
      locals: sinon.spy(),
      render: sinon.spy(),
    };

    index(req, res);
    assert.equal(res.cookie.called, true);
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
    index(req, res);
  });
});
