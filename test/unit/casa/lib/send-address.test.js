import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("send-address", () => {
  const next = sinon.stub();
  let requestStub, configStub, sendAddress;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    requestStub = sinon.stub();

    ({ sendAddress } = await esmock("../../../../app/lib/send-address.js", {
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
    sendAddress(req, res);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should call request and next successfully when no errors", () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            address: {
              houseNumber: "123 Home Lane",
              postcode: "A00AA",
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
    sendAddress(req, res, next);
    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 200 }, {});
    assert.equal(requestStub.calledOnce, true);
    const options = requestStub.getCall(0).args[0];
    assert.equal(options.method, "POST");
    assert.equal(options.json, true);
    assert.equal(options.url, `${mockUrl}/address`);
    assert.equal(next.callCount, 1);
  });

  it("should redirect to 500 page if county field populated", () => {
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
    sendAddress(req, res, next);
    assert.equal(res.status.calledOnceWith(500), true);
    assert.equal(res.redirect.calledOnceWith("/500"), true);
  });

  it("should redirect to 500 page if error response", () => {
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
    sendAddress(req, res, next);

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
    sendAddress(req, res);

    const cb = requestStub.getCall(0).args[1];
    cb(null, { statusCode: 500 }, null);
    assert.equal(res.status.calledWith(500), true);
    assert.equal(res.redirect.calledWith("/500"), true);
  });
});
