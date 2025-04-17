import nock from 'nock';
import chai from 'chai';
import cya from '../../../../app/controllers/get/checkYourAnswers.js';

const { assert } = chai;
const API_URL = 'http://localhost:3004';

global.logger = { child: () => ({ error: () => {} }) };

global.config = {
  version: '3',
  nodeEnvironment: 'test',
  apiURL: API_URL,
};

describe('Check your answers page', () => {
  const req = {
    cookies: {
      sessionId: '97w1y2guyg1wd',
      cookies_agreed: true,
    },
  };
  let res = {};
  it('should render the check your answers page if all data retrieved from apis', (done) => {
    nock(API_URL)
      .post('/queryNino')
      .reply(200, { nino: 'AA123456A' })
      .post('/queryAddress')
      .reply(200, { claimantAddress: { houseNameOrNumber: '44', postcode: 'S13 7QJ' } })
      .post('/queryMobile')
      .reply(200, { mobileNumber: '07770111111' });

    res = {
      render(template, options) {
        assert.equal(template, 'check-your-answers');
        assert.equal(options.nino, 'AA123456A');
        assert.equal(options.house, '44');
        assert.equal(options.postcode, 'S13 7QJ');
        assert.equal(options.mobile, '07770111111');
        done();
      },
    };
    cya(req, res);
  });

  it('should render the 500 error page if there is an error from one of the apis', (done) => {
    nock(API_URL)
      .post('/queryNino', { sessionId: '97w1y2guyg1we' })
      .reply(400, {})
      .post('/queryAddress', { sessionId: '97w1y2guyg1we' })
      .reply(200, { claimantAddress: { houseNameOrNumber: '55', postcode: 'LS3 7QJ' } })
      .post('/queryMobile', { sessionId: '97w1y2guyg1we' })
      .reply(200, { mobileNumber: '07770222222' });
    res = {
      render(template) {
        assert.equal(template, 'errors/500');
        done();
      },
    };
    cya(req, res);
  });
});
