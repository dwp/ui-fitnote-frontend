import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("photo-redirect", () => {
  let axiosStub, configStub, sendPhoto;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    axiosStub = sinon.stub();
    //rpStub = sinon.stub().resolves({ sessionId: "123" });

    ({ sendPhoto } = await esmock("../../../../app/lib/send-photo.js", {
      axios: axiosStub,
      config: configStub,
    }));
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should redirect to session-timeout if sessionID is undefined", async () => {
    const req = {};
    const res = { redirect: sinon.spy() };
    await sendPhoto(req, res);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should redirect to /500 if fails honeypot", async () => {
    const req = {
      sessionID: "123",
      session: {
        fitnoteImg: "123",
      },
      file: {
        userPhoto: "123",
      },
      casa: {
        journeyContext: {
          data: {
            upload: {
              imageNameField: "fail.jpg",
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
    const next = sinon.stub();
    await sendPhoto(req, res, next);
    assert.equal(res.redirect.calledWith("/500"), true);
  });

  it("should call request successfully when no errors with response", async () => {
    const req = {
      sessionID: "123",
      session: {
        fitnoteImg: "123",
      },
      file: {
        userPhoto: "123",
      },
      casa: {
        journeyContext: {
          data: {
            upload: {},
          },
        },
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    const next = sinon.stub();
    await sendPhoto(req, res, next);
    assert.equal(axiosStub.calledOnce, true);
    const options = axiosStub.getCall(0).args[0];
    assert.equal(options.method, "POST");
    assert.equal(options.url, `${mockUrl}/photo`);
  });

  it("should call request successfully when empty image and no errors with response", async () => {
    const req = {
      sessionID: "123",
      file: undefined,
      casa: {
        journeyContext: {
          data: {
            upload: {},
          },
        },
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
      redirect: sinon.spy(),
    };
    const next = sinon.stub();
    await sendPhoto(req, res, next);
    assert.equal(axiosStub.calledOnce, true);
    const options = axiosStub.getCall(0).args[0];
    assert.equal(options.method, "POST");
    assert.equal(options.url, `${mockUrl}/photo`);
  });
});
