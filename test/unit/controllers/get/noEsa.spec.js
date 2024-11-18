const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');

const noEsa = require('../../../../app/controllers/get/noEsa');

const { assert } = chai;

chai.use(chaiHttp);

describe('noEsa', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
    body: {},
    language: 'en',
  };

  it('should render the noEsa page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'no-esa');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    noEsa.noEsa(req, res);
  });
});
