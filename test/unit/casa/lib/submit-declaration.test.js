import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("submit-declaration", () => {
  let requestStub, configStub, submitDeclaration;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    requestStub = sinon.stub();

    submitDeclaration = await esmock(
      "../../../../app/lib/submit-declaration.js",
      {
        config: configStub,
        request: requestStub,
      },
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should redirect to session-timeout if sessionID is undefined", async () => {
    const req = {};
    const res = { redirect: sinon.spy() };
    await submitDeclaration(req, res);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should redirect to /complete when response is 200", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    await submitDeclaration(req, res);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, {});
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.redirect.calledOnceWith("/complete"), true);
  });

  it("should redirect to /500 when response status code is 400", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    await submitDeclaration(req, res);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 400 }, {});
    assert.equal(res.status.calledOnceWith(500), true);
    assert.equal(res.redirect.calledOnceWith("/500"), true);
  });

  it("should redirect to /500 when response status code is 500", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    await submitDeclaration(req, res);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 500 }, {});
    assert.equal(res.status.calledOnceWith(500), true);
    assert.equal(res.redirect.calledOnceWith("/500"), true);
  });

  it("should redirect to /500 when response is an error", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    await submitDeclaration(req, res);
    const cb = requestStub.getCall(0).args[1];
    cb(new Error("request failed"), null, null);
    assert.equal(res.status.calledOnceWith(500), true);
    assert.equal(res.redirect.calledOnceWith("/500"), true);
  });
});
