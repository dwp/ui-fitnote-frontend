import * as chai from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";

import esaHooks from "../../../../../app/definitions/page-hooks/esa.js";

const { assert } = chai;

describe("esa hooks", () => {
  const hooks = esaHooks();

  afterEach(() => {
    sinon.reset();
  });

  describe("preredirect hook", () => {
    it("sets validSession to true and call next", () => {
      const preredirect = hooks[0];
      const middleware = preredirect.middleware;
      const req = {
        session: {},
      };
      const res = {};
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(preredirect.hook, "preredirect");
      assert.equal(req.session.validSession, true);
      assert.equal(next.callCount, 1);
    });
  });

  describe("prerender hook", () => {
    const prerender = hooks[1];

    it("sets validSessions to true and call next (validSession undefined)", () => {
      const middleware = prerender.middleware;
      const req = {
        session: {},
      };
      const res = {};
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(prerender.hook, "prerender");
      assert.equal(req.session.validSession, true);
      assert.equal(next.callCount, 1);
    });

    it("sets validSessions to true and call next (validSession true)", () => {
      const middleware = prerender.middleware;
      const req = {
        session: {
          validSession: true,
        },
      };
      const res = {};
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(prerender.hook, "prerender");
      assert.equal(req.session.validSession, true);
      assert.equal(next.callCount, 1);
    });

    it("it redirects to session-timeout (validSession false)", () => {
      const middleware = prerender.middleware;
      const req = {
        session: {
          validSession: false,
        },
      };
      const res = {
        redirect: sinon.stub(),
      };
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(prerender.hook, "prerender");
      assert.equal(res.redirect.calledWith("/session-timeout"), true);
      assert.equal(next.callCount, 0);
    });
  });
});
