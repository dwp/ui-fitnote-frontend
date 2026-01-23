import { expect } from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";
import {
  COOKIE_CONSENT_NAME,
  COOKIE_POLICY_URL,
} from "../../../../app/utilities/constants.js";

import cookiePolicyPost from "../../../../app/routes/cookie-policy.post.js";

describe("cookie-policy", () => {
  afterEach(() => {
    sinon.reset();
  });

  it("should be an function", () => {
    expect(cookiePolicyPost).to.be.an.instanceOf(Function);
  });

  it("should add error to session and redirect back if req.body.cookieConsent is undefined", () => {
    const route = cookiePolicyPost(COOKIE_CONSENT_NAME);
    const req = {
      body: {},
      session: {
        save: (cb) => {
          return cb();
        },
      },
      url: "/invalid",
    };
    const res = {
      locals: {
        cookiePolicyUrl: COOKIE_POLICY_URL,
      },
      redirect: sinon.stub(),
    };

    route(req, res);
    expect(req.session.cookieConsentError).to.equal(
      "cookie-policy:field.cookieConsent.required",
    );
    expect(res.redirect.calledWith(COOKIE_POLICY_URL)).to.equal(true);
  });

  it("should add error to session and redirect back to policy page if url not allowed", () => {
    const route = cookiePolicyPost(COOKIE_CONSENT_NAME);
    const req = {
      body: {},
      session: {
        save: (cb) => {
          return cb();
        },
      },
      url: "/cookies/cookie_policy?backto=%2Finvalid",
    };
    const res = {
      locals: {
        cookiePolicyUrl: COOKIE_POLICY_URL,
      },
      redirect: sinon.stub(),
    };

    route(req, res);
    expect(req.session.cookieConsentError).to.equal(
      "cookie-policy:field.cookieConsent.required",
    );
    expect(res.redirect.calledWith(req.url)).to.equal(true);
  });

  it("should add error to session and redirect back if req.body.cookieConsent is not accept or reject", () => {
    const route = cookiePolicyPost(COOKIE_CONSENT_NAME);
    const req = {
      body: {
        cookieConsent: "invalid",
      },
      session: {
        save: sinon.stub(),
      },
      url: "/cookies/cookie_policy?backto=%2Fesa",
    };
    const res = {
      locals: {
        cookiePolicyUrl: COOKIE_POLICY_URL,
      },
      redirect: sinon.stub(),
    };
    route(req, res);
    expect(req.session.cookieConsentError).to.equal(
      "cookie-policy:field.cookieConsent.required",
    );
    expect(req.session.save.callCount).to.equal(1);
  });

  it("should update consent cookie if req.body.cookieConsent is accept or reject", () => {
    const route = cookiePolicyPost(COOKIE_CONSENT_NAME);
    const req = {
      body: {
        cookieConsent: "accept",
      },
      session: {
        save: sinon.stub(),
      },
      cookies: {},
      url: "/cookies/cookie_policy?backto=%2Fesa",
      query: "esa",
    };
    const res = {
      locals: {
        cookiePolicyUrl: COOKIE_POLICY_URL,
      },
      cookies: {},
      cookieOptions: {},
      cookie: function (cookieName, cookieValue, opts) {
        this.cookies[cookieName] = cookieValue;
        this.cookieOptions[cookieName] = opts;
        return this;
      },
      redirect: sinon.stub(),
    };
    route(req, res);
    expect(res.cookies)
      .to.have.property(COOKIE_CONSENT_NAME)
      .that.equals("accept");
    expect(req.session).to.have.property("cookieChoiceMade").that.equals(true);
    expect(res.cookieOptions[COOKIE_CONSENT_NAME].secure).to.be.false;
  });

  it("should set secure flag to passed value and set cookie path to mountUrl", () => {
    const route = cookiePolicyPost(
      COOKIE_CONSENT_NAME,
      "/mount-url/",
      "/",
      true,
    );
    const req = {
      body: {
        cookieConsent: "accept",
      },
      session: {
        save: sinon.stub(),
      },
      cookies: {},
      url: "/cookies/cookie_policy?backto=%2Fesa",
      query: "esa",
    };
    const res = {
      locals: {
        cookiePolicyUrl: COOKIE_POLICY_URL,
      },
      cookies: {},
      cookieOptions: {},
      cookie: function (cookieName, cookieValue, opts) {
        this.cookies[cookieName] = cookieValue;
        this.cookieOptions[cookieName] = opts;
        return this;
      },
      redirect: sinon.stub(),
    };
    route(req, res);
    expect(res.cookieOptions[COOKIE_CONSENT_NAME].secure).to.be.true;
    expect(res.cookieOptions[COOKIE_CONSENT_NAME].path).to.equal("/mount-url/");
  });

  it("should remove ga cookies if this.req.body.cookieConsent is reject", () => {
    const route = cookiePolicyPost(
      COOKIE_CONSENT_NAME,
      "/mount-url/",
      "/gtm-domain",
      true,
    );
    const req = {
      body: {
        cookieConsent: "reject",
      },
      headers: {
        cookie: "test=test; _gat=test; _ga_ABC; _ga_XYZ;",
      },
      session: {
        save: sinon.stub(),
      },
      cookies: {},
      url: "/cookies/cookie_policy?backto=%2Fesa",
      query: "esa",
    };
    const res = {
      locals: {
        cookiePolicyUrl: COOKIE_POLICY_URL,
      },
      cookies: {},
      cookieOptions: {},
      cookie: function (cookieName, cookieValue, opts) {
        this.cookies[cookieName] = cookieValue;
        this.cookieOptions[cookieName] = opts;
        return this;
      },
      redirect: sinon.stub(),
      clearCookie: sinon.stub(),
    };
    route(req, res);
    expect(
      res.clearCookie.calledWith("_gat", { domain: "/gtm-domain", path: "/" }),
    ).to.equal(true);
    expect(
      res.clearCookie.calledWith("_ga", { domain: "/gtm-domain", path: "/" }),
    ).to.equal(true);
    expect(
      res.clearCookie.calledWith("_ga_ABC", {
        domain: "/gtm-domain",
        path: "/",
      }),
    ).to.equal(true);
    expect(
      res.clearCookie.calledWith("_ga_XYZ", {
        domain: "/gtm-domain",
        path: "/",
      }),
    ).to.equal(true);
    expect(
      res.clearCookie.calledWith("_gid", { domain: "/gtm-domain", path: "/" }),
    ).to.equal(true);
  });

  it("should redirect back to backto query URL if present", () => {
    const route = cookiePolicyPost(COOKIE_CONSENT_NAME);
    const req = {
      body: {
        cookieConsent: "accept",
      },
      query: {
        backto: "http://localhost/esa",
      },
      session: {
        save: (cb) => {
          return cb();
        },
      },
      url: "/cookies/cookie_policy?backto=%2Fesa",
    };
    const res = {
      locals: {
        cookiePolicyUrl: COOKIE_POLICY_URL,
      },
      redirect: sinon.stub(),
      cookie: () => {},
    };
    route(req, res);
    expect(res.redirect.calledWith("/esa")).to.equal(true);
  });

  it("should redirect back to this.req.url if backto query is not present", () => {
    const route = cookiePolicyPost(COOKIE_CONSENT_NAME);
    const req = {
      body: {
        cookieConsent: "accept",
      },
      originalUrl: "proxy/test",
      url: "/esa",
      query: {},
      session: {
        save: (cb) => {
          return cb();
        },
      },
    };
    const res = {
      locals: {
        cookiePolicyUrl: COOKIE_POLICY_URL,
      },
      redirect: sinon.stub(),
      cookie: () => {},
    };
    route(req, res);
    expect(res.redirect.calledWith("/esa")).to.equal(true);
  });
});
