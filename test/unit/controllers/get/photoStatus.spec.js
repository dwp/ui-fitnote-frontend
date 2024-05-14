const nock = require('nock');
const chai = require('chai');
const photoStatus = require('../../../../app/controllers/get/photoStatus.js');

const { assert } = chai;
const API_URL = 'http://localhost:3004';
const IMAGE_STATUS = '/imagestatus?sessionId=123';
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
};

describe('Photo status', () => {
  const req = {
    cookies: {
      sessionId: '123',
      route: '',
      cookies_agreed: true,
    },
  };
  const queryString = '/&error=serviceFailed';
  let res = {};
  it("sets imageStatus to 'service-fail' if fitnote controller api is not available", (done) => {
    nock(API_URL).get(IMAGE_STATUS).replyWithError({
      Error: `connect ECONNREFUSED 127.0.0.1:3004
                at Object._errnoException (util.js:1022:11)
                at _exceptionWithHostPort (util.js:1044:20)
                at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1198:14)`,
      code: 'ECONNREFUSED',
      errno: 'ECONNREFUSED',
      syscall: 'connect',
      address: '127.0.0.1',
      port: 3004,
    });
    res = {
      status(code) {
        return {
          send(body) {
            assert.equal(code, 200);
            assert.equal(body, queryString);
            done();
          },
        };
      },
      cookie(name) {
        assert.equal(name, 'exp');
      },
    };
    photoStatus.photoStatus(req, res);
  });
  it("sets imageStatus to 'service-fail' if fitnote controller api returns a 400 response status code", (done) => {
    nock(API_URL).get(IMAGE_STATUS).reply(400);
    res = {
      status(code) {
        return {
          send(body) {
            assert.equal(code, 200);
            assert.equal(body, queryString);
            done();
          },
        };
      },
      cookie(name) {
        assert.equal(name, 'exp');
      },
    };
    photoStatus.photoStatus(req, res);
  });
  it("sets imageStatus to 'service-fail' if fitnote controller api returns a 500 response status code", (done) => {
    nock(API_URL).get(IMAGE_STATUS).reply(500);
    res = {
      status(code) {
        return {
          send(body) {
            assert.equal(code, 200);
            assert.equal(body, queryString);
            done();
          },
        };
      },
      cookie(name) {
        assert.equal(name, 'exp');
      },
    };
    photoStatus.photoStatus(req, res);
  });
  it('sets imageStatus to succeeded if fitnote controller api returns a 200 response status code and PASS OCR', (done) => {
    nock(API_URL).get(IMAGE_STATUS).reply(200, { fitnoteStatus: 'SUCCEEDED' });
    res = {
      status(code) {
        return {
          send(body) {
            assert.equal(code, 200);
            assert.equal(body, '/nino');
            done();
          },
        };
      },
      cookie(name) {
        assert.equal(name, 'exp');
      },
    };
    photoStatus.photoStatus(req, res);
  });
});
