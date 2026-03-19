import * as chai from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";

import textMessageHooks from "../../../../../app/definitions/page-hooks/text-message.js";

const { assert } = chai;

describe("text message hooks", () => {
  const hooks = textMessageHooks();

  afterEach(() => {
    sinon.reset();
  });

  describe("postvalidate hook", () => {
    it("should set error when validation fails", () => {
      const postvalidate = hooks[0];
      const middleware = postvalidate.middleware;
      const error = { error: "something went wrong" };
      const req = {
        casa: {
          journeyContext: {
            data: {
              "text-message": {
                textMessage: "no",
                mobileNumber: "123",
              },
            },
            getValidationErrorsForPage: () => {
              return [error];
            },
          },
        },
      };
      const res = {};

      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
      assert.equal(
        req.casa.journeyContext.data["text-message"].mobileNumber,
        undefined,
      );
      assert.equal(next.callCount, 1);
    });

    it("should call sendPhoneNumber", () => {
      const postvalidate = hooks[0];
      const middleware = postvalidate.middleware;
      const req = {
        casa: {
          journeyContext: {
            data: {
              "text-message": {
                textMessage: "no",
                mobileNumber: "123",
              },
            },
            getValidationErrorsForPage: () => {
              return [];
            },
          },
        },
      };
      const res = {
        redirect: sinon.stub(),
      };

      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
      assert.equal(res.redirect.callCount, 1);
    });
  });
});
