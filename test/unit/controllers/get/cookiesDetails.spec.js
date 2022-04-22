const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const cookieDetails = require('../../../../app/controllers/get/cookiesDetails');

const { assert } = chai;
chai.use(chaiHttp);

describe('Cookie Details', () => {
  const req = {};

  it('should render cookie details with the correct options', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'cookies-details');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    cookieDetails.cookiesDetailsPage(req, res);
  });
});
