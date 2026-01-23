import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("photo-status", () => {
  const next = sinon.stub();
  let requestStub, configStub, photoStatus;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    requestStub = sinon.stub();

    ({ photoStatus } = await esmock("../../../../app/lib/photo-status.js", {
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
    photoStatus(req, res);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should send UPLOADED status when response is UPLOADED", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "UPLOADED" });
    assert.equal(requestStub.calledOnce, true);
    const options = requestStub.getCall(0).args[0];
    assert.equal(options.method, "GET");
    assert.equal(options.url, `${mockUrl}/imagestatus?sessionId=123`);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("UPLOADED"), true);
  });

  it("should send to nino page when response is SUCCEEDED", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "SUCCEEDED" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/nino"), true);
  });

  it("should send to upload with error as serviceFailed if error response", () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            address: {
              houseNumber: "123 Home Lane",
              postcode: "A00AA",
              countyField: "ABC",
            },
          },
        },
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);

    const cb = requestStub.getCall(0).args[1];
    cb(new Error("request failed"), null, null);
    assert.equal(res.status.calledWith(200), true);
    assert.equal(res.send.calledWith("/upload?error=serviceFailed"), true);
  });

  it("should send to upload with error as ocrFailed if response is FAILED_IMG_OCR", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "FAILED_IMG_OCR" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=ocrFailed"), true);
  });

  it("should send to upload with error as ocrFailed if response is FAILED_IMG_OCR_PARTIAL", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "FAILED_IMG_OCR_PARTIAL" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=ocrFailed"), true);
  });

  it("should send to upload with error as fileSize if response is FAILED_IMG_SIZE", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "FAILED_IMG_SIZE" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=fileSize"), true);
  });

  it("should send to upload with error as maxReplay if response is FAILED_IMG_MAX_REPLAY", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "FAILED_IMG_MAX_REPLAY" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=maxReplay"), true);
  });

  it("should send to upload with error as password if response is FAILED_IMG_PASSWORD", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "FAILED_IMG_PASSWORD" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=password"), true);
  });

  it("should send to upload with error as fileType if response is FAILED_ERROR", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "FAILED_ERROR" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=fileType"), true);
  });

  it("should send to upload with error as fileType if response is FAILED_IMG_FILE_TYPE", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "FAILED_IMG_FILE_TYPE" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=fileType"), true);
  });

  it("should send to upload with error as fileType if response is FAILED_IMG_FILE_TYPE", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "FAILED_IMG_FILE_TYPE" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=fileType"), true);
  });

  it("should send to upload with error as serviceFailed if response is FAILED", () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    photoStatus(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, { fitnoteStatus: "FAILED" });
    assert.equal(requestStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=serviceFailed"), true);
  });
});
