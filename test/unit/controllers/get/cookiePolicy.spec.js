import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import cookiePolicy from '../../../../app/controllers/get/cookiePolicy.js';

const { assert } = chai;
chai.use(chaiHttp);

describe('Cookie Policy', () => {
  const req = {};

  it('should render cookie policy with the correct options', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'cookie-policy');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    cookiePolicy(req, res);
  });
});
