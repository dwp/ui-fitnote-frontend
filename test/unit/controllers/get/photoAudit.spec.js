const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const photoAudit = require('../../../../app/controllers/get/photoAudit');

const { assert } = chai;
chai.use(chaiHttp);

describe('Photo Audit Page', () => {
  const dateNow = new Date();
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      exp: dateNow,
      cookies_agreed: true,
    },
    route: 'upload',
    language: 'en',
  };

  it('Should render the Photo Audit page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'photo-audit');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    photoAudit.photoAuditPage(req, res);
  });
});
