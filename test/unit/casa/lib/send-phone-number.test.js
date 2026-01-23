import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("send-nino", () => {
  const next = sinon.stub();
  let requestStub, configStub, sendPhoneNumber;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    requestStub = sinon.stub();

    ({ sendPhoneNumber } = await esmock(
      "../../../../app/lib/send-phone-number.js",
      {
        config: configStub,
        request: requestStub,
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
    next.reset();
  });

  it("should redirect to session-timeout if sessionID is undefined", () => {
    const req = {};
    const res = { redirect: sinon.spy() };
    sendPhoneNumber(req, res);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should call next when textMessage is no", () => {
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
    sendPhoneNumber(req, res, next);
    assert.equal(next.callCount, 1);
  });

  it("should call request and next successfully when no errors", () => {
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
    sendPhoneNumber(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, {});
    assert.equal(requestStub.calledOnce, true);
    const options = requestStub.getCall(0).args[0];
    assert.equal(options.method, "POST");
    assert.equal(options.json, true);
    assert.equal(options.url, `${mockUrl}/mobile`);
    assert.equal(next.callCount, 1);
  });

  it("should redirect to 500 page if landline field populated", () => {
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
    sendPhoneNumber(req, res, next);
    assert.equal(res.status.calledOnceWith(500), true);
    assert.equal(res.redirect.calledOnceWith("/500"), true);
  });

  it("should redirect to 500 page if error response", () => {
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
    sendPhoneNumber(req, res, next);

    const cb = requestStub.getCall(0).args[1];
    cb(new Error("request failed"), null, null);
    assert.equal(res.status.calledWith(500), true);
    assert.equal(res.redirect.calledWith("/500"), true);
  });

  it("should redirect to 500 page if status code is not 2xx", () => {
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
    sendPhoneNumber(req, res);

    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 500 }, null);
    assert.equal(res.status.calledWith(500), true);
    assert.equal(res.redirect.calledWith("/500"), true);
  });
});
