import * as chai from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";

import uploadHooks from "../../../../../app/definitions/page-hooks/upload.js";

const { assert } = chai;

describe("upload hooks", () => {
  const hooks = uploadHooks();

  afterEach(() => {
    sinon.reset();
  });

  describe("prerender hook", () => {
    it("should set photoError if present", () => {
      const prerender = hooks[0];
      const middleware = prerender.middleware;
      const req = {
        session: {},
        query: {
          error: "maxReplay",
        },
        casa: {
          journeyContext: {
            setValidationErrorsForPage: sinon.stub(),
          },
        },
      };
      const res = {
        locals: {},
      };
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(prerender.hook, "prerender");
      assert.equal(
        res.locals.photoError.message,
        "upload:field.userPhoto.maxReplay",
      );
      assert.equal(next.callCount, 1);
    });
  });

  describe("postvalidate hook", () => {
    it("should set photoError if present", () => {
      const postvalidate = hooks[1];
      const middleware = postvalidate.middleware;
      const req = {
        session: {},
        casa: {
          journeyContext: {
            getValidationErrorsForPage: () => {
              return [{ message: "upload:field.userPhoto.maxReplay" }];
            },
          },
        },
      };
      const res = {
        locals: {},
      };
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
      assert.equal(
        res.locals.photoError.message,
        "upload:field.userPhoto.maxReplay",
      );
      assert.equal(next.callCount, 1);
    });

    it("should call sendPhoto if no errors", () => {
      const postvalidate = hooks[1];
      const middleware = postvalidate.middleware;
      const req = {
        session: {},
        casa: {
          journeyContext: {
            getValidationErrorsForPage: () => {
              return [];
            },
          },
        },
      };
      const res = {
        locals: {},
        redirect: sinon.stub(),
      };
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
      assert.equal(res.redirect.callCount, 1);
      assert.equal(req.session.uploadCount, 1);
    });

    it("should call sendPhoto if no errors, increment upload count", () => {
      const postvalidate = hooks[1];
      const middleware = postvalidate.middleware;
      const req = {
        session: {
          uploadCount: 1,
        },
        casa: {
          journeyContext: {
            getValidationErrorsForPage: () => {
              return [];
            },
          },
        },
      };
      const res = {
        locals: {},
        redirect: sinon.stub(),
      };
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
      assert.equal(res.redirect.callCount, 1);
      assert.equal(req.session.uploadCount, 2);
    });
  });
});
