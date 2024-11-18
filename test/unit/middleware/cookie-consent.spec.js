const chai = require('chai');
const sinon = require('sinon');
const CookieConsent = require('../../../app/middleware/cookie-consent');

const { expect } = chai;

describe('CookieConsent', () => {
  const next = sinon.spy();

  afterEach(() => {
    sinon.resetHistory();
  });

  it('Should call next and skip cookie consent when asset path', () => {
    const req = {
      path: '/assets',
    };
    const res = {};

    CookieConsent(req, res, next);
    expect(next.calledOnce).to.be.equal(true);
  });

  it('Should update res.locals when cookie consent confirmed and then call next', () => {
    const req = {
      path: '/complete',
      query: {
        cookies_updated: 1,
        previousPage: '/start',
      },
      cookies: {
        cookies_agreed: true,
      },
    };
    const res = {
      locals: {},
    };

    CookieConsent(req, res, next);
    expect(res.locals.showCookieConstentMessage).to.be.equal(false);
    expect(res.locals.showCookieChoiceConfirmationBanner).to.be.equal(true);
    expect(res.locals.cookiesConsented).to.be.equal(true);
    expect(res.locals.currentPage).to.be.equal('/complete');
    expect(res.locals.previousPage).to.be.equal('/start');
    expect(next.calledOnce).to.be.equal(true);
  });

  it('Should update res.locals when no choice made and then call next', () => {
    const req = {
      path: '/complete',
      query: {
        cookies_updated: 0,
        previousPage: '/start',
      },
      cookies: {

      },
    };
    const res = {
      locals: {},
    };

    CookieConsent(req, res, next);
    expect(res.locals.showCookieConstentMessage).to.be.equal(true);
    expect(res.locals.showCookieChoiceConfirmationBanner).to.be.equal(false);
    expect(res.locals.cookiesConsented).to.be.equal(undefined);
    expect(res.locals.currentPage).to.be.equal('/complete');
    expect(res.locals.previousPage).to.be.equal('/start');
    expect(next.calledOnce).to.be.equal(true);
  });
});
