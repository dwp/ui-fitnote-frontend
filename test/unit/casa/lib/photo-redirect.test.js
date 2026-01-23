import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("photo-redirect", () => {
  let requestStub, configStub, photoRedirect;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    requestStub = sinon.stub();

    ({ photoRedirect } = await esmock("../../../../app/lib/photo-redirect.js", {
      config: configStub,
      request: requestStub,
    }));
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should redirect to session-timeout if sessionID is undefined", () => {
    const req = {};
    const res = { redirect: sinon.spy() };
    photoRedirect(req, res);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should call request successfully when no errors", () => {
    const req = { sessionID: "123" };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoRedirect(req, res);
    assert.equal(requestStub.calledOnce, true);
    const options = requestStub.getCall(0).args[0];
    assert.equal(options.method, "GET");
    assert.equal(options.json, true);
    assert.equal(options.url, `${mockUrl}/imagestatus?sessionId=123`);
  });

  it("should send /upload?error=serviceFailed if error response", () => {
    const req = { sessionID: "123" };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoRedirect(req, res);

    const cb = requestStub.getCall(0).args[1];
    cb(new Error("request failed"), null, null);
    assert.equal(res.status.calledWith(200), true);
    assert.equal(res.send.calledWith("/upload?error=serviceFailed"), true);
  });

  it("should send /upload?error=serviceFailed if status code is 500", () => {
    const req = { sessionID: "123" };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoRedirect(req, res);

    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 500 }, null);
    assert.equal(res.status.calledWith(200), true);
    assert.equal(res.send.calledWith("/upload?error=serviceFailed"), true);
  });

  it("should send /upload?error=serviceFailed if fitnoteStatus is not SUCCEEDED", () => {
    const req = { sessionID: "123" };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoRedirect(req, res);

    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "PENDING" });
    assert.equal(res.redirect.calledWith("/upload?error=serviceFailed"), true);
  });
});
