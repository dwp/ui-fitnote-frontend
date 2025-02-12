const chai = require('chai');
const { hasViewedCookieMsg } = require('../../../app/functions/hasViewedCookieMessage');

const { expect } = chai;

function buildRes(expectedRedirect, done) {
  return {
    cookieData: [],
    cookie(name, value, options) {
      this.cookieData.push({ name, value, options });
    },
    clearCookie() {
      this.cookieData = [];
    },
    status: () => ({
      render: (template) => {
        expect(template).to.be.equal(expectedRedirect);
        done();
      },
    }),
    redirect(template) {
      expect(template).to.be.equal(expectedRedirect);
      done();
    },
  };
}

describe('hasViewedCookieMsg', () => {
  it('Viewed cookie message (consented to cookies) and redirected to path', (done) => {
    const expectedRedirect = '/complete?consent=true&cookies_updated=1';
    const req = {
      query: {
        consent: 'true',
        postback: '/complete',
      },
    };
    const res = buildRes(expectedRedirect, done);

    hasViewedCookieMsg(req, res);
    expect(res.cookieData[0].name).to.be.equal('cookies_agreed');
    expect(res.cookieData[0].value).to.be.equal('true');
    expect(res.redirectedTo).to.equal('/complete');
  });

  it('Viewed cookie message (not consented to cookies) and redirected to path', (done) => {
    const expectedRedirect = '/complete?consent=false&cookies_updated=1';
    const req = {
      query: {
        consent: 'false',
        postback: '/complete',
      },
      cookies: [],
    };
    const res = buildRes(expectedRedirect, done);

    hasViewedCookieMsg(req, res);
    expect(res.cookieData).to.be.equal([]);
    expect(res.redirectedTo).to.equal('/complete');
  });

  it('Viewed cookie message with invalid postback and rendered to error message ', (done) => {
    const expectedTemplate = 'errors/500';
    const req = {
      query: {
        consent: 'true',
        postback: '/start',
      },
    };
    const res = buildRes(expectedTemplate, done);

    hasViewedCookieMsg(req, res);
    expect(res.cookieData[0].name).to.be.equal('cookies_agreed');
    expect(res.cookieData[0].value).to.be.equal('true');
    expect(res.status).to.equal(500);
  });
});
