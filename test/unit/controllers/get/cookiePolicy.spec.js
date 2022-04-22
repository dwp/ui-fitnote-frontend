const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const cookiePolicy = require('../../../../app/controllers/get/cookiePolicy');

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
    cookiePolicy.cookiePolicyPage(req, res);
  });
});
