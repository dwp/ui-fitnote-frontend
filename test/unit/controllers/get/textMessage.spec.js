const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const nock = require('nock');
const textMessage = require('../../../../app/controllers/get/textMessage');

const { assert } = chai;
chai.use(chaiHttp);

describe('Text Message Page', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd555',
      cookies_agreed: true,
    },
    query: {
      ref: '',
      statusCode: 200,
    },
    body: {},
    language: 'en',
  };

  it('Should render the Text Message page', (done) => {
    const res = {
      render(template, options) {
        assert.equal(template, 'text-message');
        assert.equal(options.version, process.env.npm_package_version);
        assert.equal(options.environment, config.util.getEnv('NODE_ENV'));
        done();
      },
    };
    nock(config.get('api.url'))
      .post('/queryMobile')
      .reply(200, req.body);
    textMessage.textMessagePage(req, res);
  });
});
