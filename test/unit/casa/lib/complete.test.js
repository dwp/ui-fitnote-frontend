import { assert } from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";

import { complete } from "../../../../app/lib/complete.js";

const makeResponse = () => {
  return {
    status: () => ({}),
    clearCookie: () => {},
  };
};

const makeRequest = (sessionAttrs = {}, attrs = {}) => {
  const req = {
    session: {
      ...sessionAttrs,
      cookie: true,
      id: 1,
      downloadContext: {
        transactionID: "a12c",
      },
    },
    ...attrs,
  };
  Object.defineProperty(req.session, "save", {
    enumerable: false,
    configurable: true,
    value: (cb) => cb(),
  });

  Object.defineProperty(req.session, "regenerate", {
    enumerable: false,
    configurable: true,
    value: (cb) => cb(),
  });
  return req;
};

describe("complete", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should render complete page", () => {
    const req = makeRequest();
    const res = makeResponse();
    res.render = sinon.stub();

    complete(req, res);
    assert.equal(res.render.calledOnceWith("pages/complete.njk"), true);
  });

  it("should direct to 500  page on error", () => {
    const req = makeRequest();
    const res = makeResponse();
    res.status = () => ({
      redirect: (template) => {
        assert.equal(template, "/500");
      },
    });

    complete(req, res);
  });
});
