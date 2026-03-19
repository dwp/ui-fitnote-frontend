import * as chai from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";

import checkYourAnswersHooks from "../../../../../app/definitions/page-hooks/check-your-answers.js";

const { assert } = chai;

describe("check your answers hooks", () => {
  const hooks = checkYourAnswersHooks();

  afterEach(() => {
    sinon.reset();
  });

  describe("prerender hook", () => {
    it("should generate locals content and call next (no text message)", () => {
      const prerender = hooks[0];
      const middleware = prerender.middleware;
      const req = {
        baseUrl: "localhost",
        t: sinon.stub(),
        casa: {
          journeyContext: {
            data: {
              nino: {
                nino: "AB123456C",
              },
              "text-message": {
                textMessage: "no",
              },
              address: {
                houseNumber: "123 Home Lane",
                postcode: "A01AA",
              },
            },
            isDefault: sinon.stub(),
            identity: {},
          },
        },
      };
      const res = {
        locals: {},
      };
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(prerender.hook, "prerender");
      assert.equal(res.locals.rows[0].value.text, "AB123456C");
      assert.equal(res.locals.rows[1].value.html, "123 Home Lane<br>A01AA");
      assert.equal(next.callCount, 1);
    });

    it("should generate locals content and call next (with text message)", () => {
      const prerender = hooks[0];
      const middleware = prerender.middleware;
      const req = {
        baseUrl: "localhost",
        t: sinon.stub(),
        casa: {
          journeyContext: {
            data: {
              nino: {
                nino: "AB123456C",
              },
              "text-message": {
                textMessage: "yes",
                mobileNumber: "123456789",
              },
              address: {
                houseNumber: "123 Home Lane",
                postcode: "A01AA",
              },
            },
            isDefault: sinon.stub(),
            identity: {},
          },
        },
      };
      const res = {
        locals: {},
      };
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(prerender.hook, "prerender");
      assert.equal(res.locals.rows[0].value.text, "AB123456C");
      assert.equal(res.locals.rows[1].value.html, "123 Home Lane<br>A01AA");
      assert.equal(res.locals.rows[3].value.text, "123456789");
      assert.equal(next.callCount, 1);
    });
  });

  describe("postvalidate hook", () => {
    it("should call submitDeclaration", () => {
      const postvalidate = hooks[1];
      const middleware = postvalidate.middleware;
      const req = {};
      const res = {
        redirect: sinon.stub(),
      };
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
    });
  });
});
