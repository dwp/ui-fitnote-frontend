import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("photo-redirect", () => {
  let axiosStub, configStub, photoRedirect;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    axiosStub = sinon.stub();

    ({ photoRedirect } = await esmock("../../../../app/lib/photo-redirect.js", {
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
    await photoRedirect(req, res);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should call request successfully when no errors", async () => {
    const req = { sessionID: "123" };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({ status: 200 });
    await photoRedirect(req, res);

    assert.equal(axiosStub.calledOnce, true);
    const options = axiosStub.getCall(0).args[0];
    assert.equal(options.method, "GET");
    assert.equal(options.url, `${mockUrl}/imagestatus?sessionId=123`);
  });

  it("should send /upload?error=serviceFailed if error response", async () => {
    const req = { sessionID: "123" };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.rejects({ message: "Network Error", isAxiosError: true });
    await photoRedirect(req, res);

    assert.equal(res.status.calledWith(200), true);
    assert.equal(res.send.calledWith("/upload?error=serviceFailed"), true);
  });

  it("should send /upload?error=serviceFailed if status code is 500", async () => {
    const req = { sessionID: "123" };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    const error = new Error("Request failed with status code 500");
    error.response = { status: 500 };
    axiosStub.rejects(error);
    await photoRedirect(req, res);

    assert.equal(res.status.calledWith(200), true);
    assert.equal(res.send.calledWith("/upload?error=serviceFailed"), true);
  });

  it("should send /upload?error=serviceFailed if fitnoteStatus is not SUCCEEDED", async () => {
    const req = { sessionID: "123" };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    axiosStub.resolves({ status: 200, data: { fitnoteStatus: "PENDING" } });
    await photoRedirect(req, res);

    assert.equal(res.redirect.calledWith("/upload?error=serviceFailed"), true);
  });

  it("should call next if fitnoteStatus is FAILED_IMG_OCR and set image-problem fields in session", async () => {
    const req = {
      sessionID: "123",
      session: {
        fitnoteImg: "123",
        visibleRegion: "TOP_RIGHT",
      },
      casa: {
        journeyContext: {
          data: {
            "photo-audit": {
              photoAudit: "image-problem",
            },
            upload: {
              userPhoto: {
                type: "application/pdf",
              },
            },
          },
        },
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
      locals: {},
    };
    const next = sinon.stub();
    axiosStub.resolves({
      status: 200,
      data: {
        fitnoteStatus: "FAILED_IMG_OCR",
        image: "base64-img",
        visibleRegion: "BASE_LEFT",
      },
    });
    await photoRedirect(req, res, next);
    assert.equal(next.calledOnce, true);
    assert.equal(req.session.fitnoteImg, "base64-img");
    assert.equal(req.session.visibleRegion, "BASE_LEFT");
  });
});
