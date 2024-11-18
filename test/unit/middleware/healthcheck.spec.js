const { expect } = require('chai');
const { healthCheck } = require('../../../app/middleware/healthcheck');

describe('healthCheck', () => {
  it('should should return 200 and send okay', (done) => {
    const expectedStatusCode = 200;
    const expectedMessage = 'okay';
    const req = {};
    const res = {
      status: (statusCode) => ({
        send: (message) => {
          expect(statusCode).to.be.equal(expectedStatusCode);
          expect(message).to.be.equal(expectedMessage);
          done();
        },
      }),
    };

    healthCheck(req, res);
  });
});
