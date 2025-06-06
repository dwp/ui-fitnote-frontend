import chai from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';

import guidancePost from '../../../../app/controllers/get/guidancePost.js';

const { assert } = chai;

chai.use(chaiHttp);

describe('guidancePost', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
    body: {},
    language: 'en',
  };

  it('should render the guidancePost page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'guidance-post');
        assert.equal(options.route, 'guidance-post');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    guidancePost(req, res);
  });
});
