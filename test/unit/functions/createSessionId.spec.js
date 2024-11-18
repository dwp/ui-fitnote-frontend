const { expect } = require('chai');
const { createSessionId } = require('../../../app/functions/createSessionId');

describe('createSessionId', () => {
  it('Should return sessionId and populate res data', () => {
    const req = {
      language: 'en',
    };
    const res = {
      cookieData: [],
      cookie(name, value, options) {
        this.cookieData.push({ name, value, options });
      },
      locals: {},
    };

    const id = createSessionId(req, res);

    expect(id.length).to.be.equal(32);
    expect(res.locals.lang).to.be.equal('en');
    expect(res.locals).to.have.property('exp');
    expect(res.cookieData[0].name).to.be.equal('sessionId');
    expect(res.cookieData[0].value).to.be.equal(id);
    expect(res.cookieData[1].name).to.be.equal('exp');
  });
});
