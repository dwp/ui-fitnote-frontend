import * as chai from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";

import imageProblemHooks from "../../../../../app/definitions/page-hooks/image-problem.js";

const { assert } = chai;

describe("image problem hooks", () => {
  const hooks = imageProblemHooks();

  afterEach(() => {
    sinon.reset();
  });

  describe("prerender hook", () => {
    it("should call next and set locals (paper guidance and hide banner)", async () => {
      const prerender = hooks[0];
      const middleware = prerender.middleware;
      const req = {
        session: {
          fitnoteImg: "123",
        },
        casa: {
          journeyContext: {
            data: {
              "method-obtained": {
                methodObtained: "paper",
              },
            },
          },
        },
      };
      const res = {
        locals: {
          fitnoteImg: "0",
          guidanceLink: "digital",
          showGuidance: false,
        },
      };

      const next = sinon.stub();
      await middleware(req, res, next);
      assert.equal(prerender.hook, "prerender");
      assert.equal(res.locals.fitnoteImg, "123");
      assert.equal(res.locals.guidanceLink, "/paper-guidance");
      assert.equal(res.locals.showGuidance, false);
      assert.equal(next.callCount, 1);
    });

    it("should call next and set locals (digital guidance and show banner)", async () => {
      const prerender = hooks[0];
      const middleware = prerender.middleware;
      const req = {
        session: {
          fitnoteImg: "123",
          visibleRegion: "TOP_HALF",
          uploadCount: 2,
        },
        casa: {
          journeyContext: {
            data: {
              "method-obtained": {
                methodObtained: "digital",
              },
            },
          },
        },
      };
      const res = {
        locals: {
          fitnoteImg: "0",
          guidanceLink: "paper",
          showGuidance: false,
        },
      };

      const next = sinon.stub();
      await middleware(req, res, next);
      assert.equal(prerender.hook, "prerender");
      assert.equal(res.locals.fitnoteImg, "123");
      assert.equal(res.locals.guidanceLink, "/digital-guidance");
      assert.equal(res.locals.showGuidance, true);
      assert.equal(res.locals.visibleRegion, "TOP_HALF");
      assert.equal(next.callCount, 1);
    });
  });
});
