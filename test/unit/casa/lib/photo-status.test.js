import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("photo-status", () => {
  const next = sinon.stub();
  let axiosStub, configStub, photoStatus;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    axiosStub = sinon.stub();

    ({ photoStatus } = await esmock("../../../../app/lib/photo-status.js", {
      config: configStub,
      axios: axiosStub,
    }));
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should redirect to session-timeout if sessionID is undefined", async () => {
    const req = {};
    const res = { redirect: sinon.spy() };
    await photoStatus(req, res);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should send UPLOADED status when response is UPLOADED", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({ status: 200, data: { fitnoteStatus: "UPLOADED" } });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    const options = axiosStub.getCall(0).args[0];
    assert.equal(options.method, "GET");
    assert.equal(options.url, `${mockUrl}/imagestatus?sessionId=123`);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("UPLOADED"), true);
  });

  it("should send to nino page when response is SUCCEEDED", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({ status: 200, data: { fitnoteStatus: "SUCCEEDED" } });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/nino"), true);
  });

  it("should send to upload with error as serviceFailed if error response", async () => {
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
    axiosStub.rejects({ message: "Network Error", isAxiosError: true });
    await photoStatus(req, res, next);

    assert.equal(res.status.calledWith(200), true);
    assert.equal(res.send.calledWith("/upload?error=serviceFailed"), true);
  });

  it("should send to image-problem if response is FAILED_IMG_OCR", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({
      status: 200,
      data: { fitnoteStatus: "FAILED_IMG_OCR" },
    });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/image-problem"), true);
  });

  it("should send to image-problem if response is FAILED_IMG_OCR_PARTIAL", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({
      status: 200,
      data: { fitnoteStatus: "FAILED_IMG_OCR_PARTIAL" },
    });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/image-problem"), true);
  });

  it("should send to upload with error as fileSize if response is FAILED_IMG_SIZE", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({
      status: 200,
      data: { fitnoteStatus: "FAILED_IMG_SIZE" },
    });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=fileSize"), true);
  });

  it("should send to upload with error as maxReplay if response is FAILED_IMG_MAX_REPLAY", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({
      status: 200,
      data: { fitnoteStatus: "FAILED_IMG_MAX_REPLAY" },
    });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=maxReplay"), true);
  });

  it("should send to upload with error as password if response is FAILED_IMG_PASSWORD", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({
      status: 200,
      data: { fitnoteStatus: "FAILED_IMG_PASSWORD" },
    });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=password"), true);
  });

  it("should send to upload with error as fileType if response is FAILED_ERROR", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({
      status: 200,
      data: { fitnoteStatus: "FAILED_ERROR" },
    });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=fileType"), true);
  });

  it("should send to upload with error as fileType if response is FAILED_IMG_FILE_TYPE", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({
      status: 200,
      data: { fitnoteStatus: "FAILED_IMG_FILE_TYPE" },
    });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=fileType"), true);
  });

  it("should send to upload with error as serviceFailed if response is FAILED", async () => {
    const req = {
      sessionID: "123",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({ status: 200, data: { fitnoteStatus: "FAILED" } });
    await photoStatus(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(200), true);
    assert.equal(res.send.calledOnceWith("/upload?error=serviceFailed"), true);
  });
});
