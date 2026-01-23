import * as chai from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";

import ninoHooks from "../../../../../app/definitions/page-hooks/nino.js";

const { assert } = chai;

describe("nino hooks", () => {
  const hooks = ninoHooks();

  afterEach(() => {
    sinon.reset();
  });

  describe("prevalidate hook", () => {
    it("should sanitise nino value", () => {
      const prevalidate = hooks[0];
      const middleware = prevalidate.middleware;
      const req = {
        casa: {
          journeyContext: {
            data: {
              nino: {
                nino: "Ab 12 34 56 c",
              },
            },
          },
        },
      };
      const res = {};
      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(prevalidate.hook, "prevalidate");
      assert.equal(req.casa.journeyContext.data.nino.nino, "AB123456C");
      assert.equal(next.callCount, 1);
    });
  });

  describe("postvalidate hook", () => {
    it("should set error when validation fails", () => {
      const postvalidate = hooks[1];
      const middleware = postvalidate.middleware;
      const error = { error: "invalid nino" };
      const req = {
        casa: {
          journeyContext: {
            data: {
              nino: {
                nino: "AB123456C",
              },
            },
            getValidationErrorsForPage: () => {
              return [error];
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
      assert.equal(res.locals.ninoError, error);
      assert.equal(next.callCount, 1);
    });

    it("should call sendNino when no validation errors", () => {
      const postvalidate = hooks[1];
      const middleware = postvalidate.middleware;
      const req = {
        casa: {
          journeyContext: {
            data: {
              nino: {
                nino: "AB123456C",
              },
            },
            getValidationErrorsForPage: () => {
              return [];
            },
          },
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        redirect: sinon.stub().returnsThis(),
      };

      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
      assert.equal(res.redirect.callCount, 1);
    });
  });
});
