import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';

import noFitnoteNeeded from '../../../../app/controllers/get/noFitnoteNeeded.js';

const { assert } = chai;

chai.use(chaiHttp);

describe('noFitnoteNeeded', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
    body: {},
    language: 'en',
  };

  it('should render the noFitnoteNeeded page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'no-fitnote-needed');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    noFitnoteNeeded(req, res);
  });
});
