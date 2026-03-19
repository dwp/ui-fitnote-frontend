import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("send-address", () => {
  const next = sinon.stub();
  let axiosStub, configStub, sendAddress;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };
    axiosStub = sinon.stub();

    ({ sendAddress } = await esmock("../../../../app/lib/send-address.js", {
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
    await sendAddress(req, res);
    assert.equal(axiosStub.callCount, 0);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should call request and next successfully when no errors", async () => {
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
    axiosStub.resolves({ status: 200 });
    await sendAddress(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    const options = axiosStub.getCall(0).args[0];
    assert.equal(options.method, "POST");
    assert.equal(options.url, `${mockUrl}/address`);
    assert.equal(next.callCount, 1);
  });

  it("should redirect to 500 page if county field populated", async () => {
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
    await sendAddress(req, res, next);
    assert.equal(axiosStub.callCount, 0);
    assert.equal(res.status.calledOnceWith(500), true);
    assert.equal(res.redirect.calledOnceWith("/500"), true);
  });

  it("should redirect to 500 page if error response", async () => {
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
    axiosStub.rejects({ message: "Network Error", isAxiosError: true });
    await sendAddress(req, res, next);

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
    axiosStub.resolves({ status: 210 });
    await sendAddress(req, res);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledWith(500), true);
    assert.equal(res.redirect.calledWith("/500"), true);
  });
});
