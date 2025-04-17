import config from 'config';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import nock from 'nock';
import accessibilityStatement from '../../../../app/controllers/get/accessibilityStatement.js';

const { expect } = chai;
const { assert } = chai;

chai.use(chaiHttp);
chai.use(spies);

describe('Accessibility Statement', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
  };

  it('Should call accessibility function successfully', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'accessibility-statement');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    const spy = chai.spy.on(accessibilityStatement, 'accessibilityPage');
    accessibilityStatement(req, res);
    expect(spy).to.have.been.called();
    expect(spy).to.have.been.called.with(req, res);
  });

  it('Should make a GET request to accessibility statement page'
        + ' successfully', (done) => {
    nock('http://localhost:3004')
      .get('/accessibility-statement')
      .reply(200, {});
    const res = {
      render(template, options) {
        assert.equal(template, 'accessibility-statement');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    accessibilityStatement(req, res);
  });
});
