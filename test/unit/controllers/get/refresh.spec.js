const nock = require('nock');
const chai = require('chai');
const refresh = require('../../../../app/controllers/get/refresh.js');

const API_URL = 'http://localhost:3004';
const API_SESSION = '/extendSession?sessionId=97w1y2guyg1we';

const { assert } = chai;
global.logger = {
  child: () => ({
    info: () => {},
    error: () => {},
  }),
};

global.config = {
  version: '3',
  nodeEnvironment: 'test',
  apiURL: API_URL,
  sessionExpiryPeriod: 120000,
};

describe('Session expiry time reset', () => {
  const req = {
    body: {
      page: '/check-your-answers',
    },
    cookies: { sessionId: '97w1y2guyg1we' },
  };
  let res = {};

  it('should render the 500 error page if there is a 500 error from calling the api', (done) => {
    nock(API_URL)
      .get(API_SESSION)
      .reply(500, {});
    res = {
      status(code) {
        assert.equal(code, 500);
        return {
          render(template) {
            assert.equal(template, 'errors/500');
            done();
          },
        };
      },
    };
    refresh.refresh(req, res);
  });

  it('should render the 500 error page if there is a 400 error from the api', (done) => {
    nock(API_URL)
      .get(API_SESSION)
      .reply(400, {});
    res = {
      status() {
        return {
          render(template) {
            assert.equal(template, 'errors/500');
            done();
          },
        };
      },
    };
    refresh.refresh(req, res);
  });

  it('should reset the session expiry time and render the existing page when api call is successful', (done) => {
    nock(API_URL)
      .get(API_SESSION)
      .reply(200, {});
    res = {
      status(code) {
        return {
          json(body) {
            assert.equal(code, 200);
            assert.equal(body.message, 'OK');
            assert.equal(body.status, 200);
            done();
          },
        };
      },
      cookie(name) {
        assert.equal(name, 'exp');
      },
    };
    refresh.refresh(req, res);
  });
});
