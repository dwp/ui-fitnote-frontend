import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("send-nino", () => {
  const next = sinon.stub();
  let axiosStub, configStub, sendPhoneNumber;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    axiosStub = sinon.stub();

    ({ sendPhoneNumber } = await esmock(
      "../../../../app/lib/send-phone-number.js",
      {
        config: configStub,
        axios: axiosStub,
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
    next.reset();
  });

  it("should redirect to session-timeout if sessionID is undefined", async () => {
    const req = {};
    const res = { redirect: sinon.spy() };
    sendPhoneNumber(req, res);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should call next when textMessage is no", async () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            "text-message": {
              mobileNumber: undefined,
              textMessage: "no",
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
    await sendPhoneNumber(req, res, next);
    assert.equal(next.callCount, 1);
  });

  it("should call request and next successfully when no errors", async () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            "text-message": {
              mobileNumber: "123456789",
              textMessage: "yes",
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
    axiosStub.resolves({ status: 200 });
    await sendPhoneNumber(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    const options = axiosStub.getCall(0).args[0];
    assert.equal(options.method, "POST");
    assert.equal(options.url, `${mockUrl}/mobile`);
    assert.equal(next.callCount, 1);
  });

  it("should redirect to 500 page if landline field populated", async () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            "text-message": {
              mobileNumber: "123456789",
              landlineField: "987654321",
              textMessage: "yes",
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
    await sendPhoneNumber(req, res, next);
    assert.equal(res.status.calledOnceWith(500), true);
    assert.equal(res.redirect.calledOnceWith("/500"), true);
  });

  it("should redirect to 500 page if error response", async () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            "text-message": {
              mobileNumber: "123456789",
              textMessage: "yes",
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
    await sendPhoneNumber(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledWith(500), true);
    assert.equal(res.redirect.calledWith("/500"), true);
  });

  it("should redirect to 500 page if status code is not 2xx", async () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            "text-message": {
              mobileNumber: "123456789",
              textMessage: "yes",
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
    axiosStub.resolves({ status: 210 });
    await sendPhoneNumber(req, res);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledWith(500), true);
    assert.equal(res.redirect.calledWith("/500"), true);
  });
});
