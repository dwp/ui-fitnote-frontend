import { expect } from "chai";
import { describe, it } from "mocha";
import { cookieMiddleware } from "../../../../app/middleware/cookie-message.js";
import {
  COOKIE_CONSENT_NAME,
  COOKIE_POLICY_URL,
  COOKIE_DETAILS_URL,
} from "../../../../app/utilities/constants.js";

describe("cookie-message", () => {
  const mountUrl = "/";
  it("should return middleware as a function", () => {
    expect(
      cookieMiddleware(
        mountUrl,
        COOKIE_CONSENT_NAME,
        COOKIE_POLICY_URL,
        COOKIE_DETAILS_URL,
      ),
    ).to.be.an.instanceOf(Function);
  });

  it("should set cookieChoiceMade template variable", () => {
    const req = {
      session: {
        cookieChoiceMade: true,
      },
      cookies: {},
    };
    const res = {
      locals: {},
    };
    const mw = cookieMiddleware(
      mountUrl,
      COOKIE_CONSENT_NAME,
      COOKIE_POLICY_URL,
      COOKIE_DETAILS_URL,
    );
    mw(req, res, () => {});
    expect(res.locals)
      .to.have.property("cookieChoiceMade")
      .that.deep.equals(true);
    expect(req.session.cookieChoiceMade).to.equal(undefined);
  });

  it("should add consent cookie value to template variable", () => {
    const req = {
      session: {
        cookieChoiceMade: true,
      },
      cookies: {
        cookies_agreed: "test",
      },
    };
    const res = {
      locals: {},
    };
    const mw = cookieMiddleware(
      mountUrl,
      COOKIE_CONSENT_NAME,
      COOKIE_POLICY_URL,
      COOKIE_DETAILS_URL,
    );
    mw(req, res, () => {});
    expect(res.locals)
      .to.have.property("consentCookieValue")
      .that.equals("test");
  });

  it("should set cookie policy URL template variable", () => {
    const req = {
      session: {
        cookieChoiceMade: true,
      },
      cookies: {
        cookies_agreed: "test",
      },
      url: "/esa",
    };
    const res = {
      locals: {},
    };
    const mw = cookieMiddleware(
      mountUrl,
      COOKIE_CONSENT_NAME,
      COOKIE_POLICY_URL,
      COOKIE_DETAILS_URL,
    );
    mw(req, res, () => {});
    expect(res.locals)
      .to.have.property("cookiePolicyUrl")
      .that.equals(`${COOKIE_POLICY_URL}?backto=%2Fesa`);
  });

  it("should set cookie policy footer URL template variable for cookie details page", () => {
    const req = {
      session: {
        cookieChoiceMade: true,
      },
      cookies: {
        cookies_agreed: "test",
      },
      url: `${COOKIE_DETAILS_URL}?backto=%2Fesa`,
    };
    const res = {
      locals: {},
    };

    const mw = cookieMiddleware(
      mountUrl,
      COOKIE_CONSENT_NAME,
      COOKIE_POLICY_URL,
      COOKIE_DETAILS_URL,
    );
    mw(req, res, () => {});
    expect(res.locals)
      .to.have.property("cookiePolicyUrl")
      .that.equals(`${COOKIE_POLICY_URL}?backto=esa`);
  });

  it("should not double up on backto queries", () => {
    const req = {
      session: {
        cookieChoiceMade: true,
      },
      cookies: {
        cookies_agreed: "test",
      },
      url: `${COOKIE_POLICY_URL}?backto=%esa`,
    };
    const res = {
      locals: {},
    };
    const mw = cookieMiddleware(
      mountUrl,
      COOKIE_CONSENT_NAME,
      COOKIE_POLICY_URL,
      COOKIE_DETAILS_URL,
    );
    mw(req, res, () => {});
    expect(res.locals).to.have.property("cookiePolicyUrl").that.equals(req.url);
  });
});
