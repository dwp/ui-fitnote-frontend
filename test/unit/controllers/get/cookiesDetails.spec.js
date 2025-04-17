import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import cookieDetails from '../../../../app/controllers/get/cookiesDetails.js';

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
    cookieDetails(req, res);
  });
});
