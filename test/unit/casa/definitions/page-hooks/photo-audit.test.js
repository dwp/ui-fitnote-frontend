import * as chai from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";

import photoAuditHooks from "../../../../../app/definitions/page-hooks/photo-audit.js";

const { assert } = chai;

describe("photo audit hooks", () => {
  const hooks = photoAuditHooks();

  afterEach(() => {
    sinon.reset();
  });

  describe("postvalidate hook", () => {
    it("postvalidate hook exists", async () => {
      const postvalidate = hooks[0];
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
      await middleware(req, res, next);
      assert.equal(postvalidate.hook, "postvalidate");
    });
  });
});
