import * as chai from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";

import addressHooks from "../../../../../app/definitions/page-hooks/address.js";

const { assert } = chai;

describe("addressHooks hooks", () => {
  const hooks = addressHooks();

  afterEach(() => {
    sinon.reset();
  });

  describe("prevalidate hook", () => {
    it("should sanitise postcode then call next", () => {
      const prevalidate = hooks[0];
      const middleware = prevalidate.middleware;
      const req = {
        casa: {
          journeyContext: {
            data: {
              address: {
                houseNumber: "123 home lane",
                postcode: "a0 0aa",
              },
            },
          },
        },
      };
      const res = {};

      const next = sinon.stub();
      middleware(req, res, next);
      assert.equal(prevalidate.hook, "prevalidate");
      assert.equal(req.casa.journeyContext.data.address.postcode, "A00AA");
      assert.equal(next.callCount, 1);
    });
  });

  describe("postvalidate hook", () => {
    it("should call next if errors from validation", async () => {
      const postvalidate = hooks[1];
      const middleware = postvalidate.middleware;
      const req = {
        casa: {
          journeyContext: {
            data: {
              address: {
                houseNumber: "123 home lane",
                postcode: "a0 0aa",
              },
            },
            getValidationErrorsForPage: () => {
              return [{ error: "address error" }];
            },
          },
        },
      };
      const res = {};

      const next = sinon.stub();
      await middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
      assert.equal(next.callCount, 1);
    });

    it("should call sendAddress if no errors from validation", async () => {
      const postvalidate = hooks[1];
      const middleware = postvalidate.middleware;
      const req = {
        casa: {
          journeyContext: {
            data: {
              address: {
                houseNumber: "123 home lane",
                postcode: "a0 0aa",
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
      await middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
      assert.equal(res.redirect.callCount, 1);
    });
  });
});
