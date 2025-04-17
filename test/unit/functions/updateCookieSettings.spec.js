import chai from 'chai';
import updateCookieSettings from '../../../app/functions/updateCookieSettings.js';

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
    locals: {},
  };
}

describe('updateCookieSettings', () => {
  const req = {
    body: {
      consent: 'true',
      previousPage: '/upload',
    },
  };
  it('Should update cookie settings (cookie consent true) and redirect to previous path', (done) => {
    const expectedRedirect = '/upload?cookies_updated=1';
    const res = buildRes(expectedRedirect, done);

    updateCookieSettings(req, res);
    expect(res.locals.showCookieChoiceConfirmationBanner).to.be.equal(true);
    expect(res.cookieData[0].name).to.be.equal('cookies_agreed');
    expect(res.cookieData[0].value).to.be.equal('true');
    expect(res.redirectedTo).to.equal('/upload');
  });

  it('Should update cookie settings (cookie consent false) and redirect to previous path', (done) => {
    const expectedRedirect = '/upload?cookies_updated=1';
    req.body.consent = 'false';
    req.cookies = [{ name: 'cookies_agreed', value: 'true' }];
    const res = buildRes(expectedRedirect, done);

    updateCookieSettings(req, res);
    expect(res.locals.showCookieChoiceConfirmationBanner).to.be.equal(true);
    expect(res.cookieData).to.be.equal([]);
    expect(res.redirectedTo).to.equal('/upload');
  });

  it('Should update cookie settings and redirect to cookie policy page', (done) => {
    const expectedRedirect = 'cookies/cookie_policy?cookies_updated=1';
    req.body.consent = 'true';
    delete req.body.previousPage;
    const res = buildRes(expectedRedirect, done);

    updateCookieSettings(req, res);
    expect(res.locals.showCookieChoiceConfirmationBanner).to.be.equal(true);
    expect(res.cookieData[0].name).to.be.equal('cookies_agreed');
    expect(res.cookieData[0].value).to.be.equal('true');
    expect(res.redirectedTo).to.equal('/cookies/cookie_policy');
  });

  it('Should update cookie settings and render error page when previous page is not validated', (done) => {
    const expectedTemplate = 'errors/500';
    req.body.previousPage = '/start';
    const res = buildRes(expectedTemplate, done);

    updateCookieSettings(req, res);
    expect(res.locals.showCookieChoiceConfirmationBanner).to.be.equal(true);
    expect(res.cookieData[0].name).to.be.equal('cookies_agreed');
    expect(res.cookieData[0].value).to.be.equal('true');
    expect(res.status).to.equal(500);
  });
});
