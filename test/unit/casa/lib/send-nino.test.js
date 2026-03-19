import { assert } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import esmock from "esmock";

describe("send-nino", async () => {
  const next = sinon.stub();
  let axiosStub, configStub, sendNino;
  const mockUrl = "http://mockurl.com";

  beforeEach(async () => {
    configStub = {
      get: sinon.stub().withArgs("api.url").returns(mockUrl),
    };

    axiosStub = sinon.stub();

    ({ sendNino } = await esmock("../../../../app/lib/send-nino.js", {
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
    await sendNino(req, res);

    assert.equal(axiosStub.callCount, 0);
    assert.equal(res.redirect.calledOnceWith("/session-timeout"), true);
  });

  it("should call request and next successfully when no errors", async () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            nino: {
              nino: "AB12345C",
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
    await sendNino(req, res, next);

    assert.equal(axiosStub.calledOnce, true);
    const options = axiosStub.getCall(0).args[0];
    assert.equal(options.method, "POST");
    assert.equal(options.url, `${mockUrl}/nino`);
    assert.equal(next.callCount, 1);
  });

  it("should redirect to 500 page if email field populated", async () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            nino: {
              nino: "AB12345C",
              emailField: "fail@test.com",
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

    await sendNino(req, res, next);

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
            nino: {
              nino: "AB12345C",
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
    await sendNino(req, res, next);

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
            nino: {
              nino: "AB12345C",
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
    await sendNino(req, res);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledWith(500), true);
    assert.equal(res.redirect.calledWith("/500"), true);
  });

  it("should redirect to 500 page if http status code 500", async () => {
    const req = {
      sessionID: "123",
      casa: {
        journeyContext: {
          data: {
            nino: {
              nino: "AB12345C",
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

    const error = new Error("Request failed with status code 500");
    error.response = { status: 500 };
    axiosStub.rejects(error);
    await sendNino(req, res);

    assert.equal(axiosStub.calledOnce, true);
    assert.equal(res.status.calledOnceWith(500), true);
    assert.equal(res.redirect.calledOnceWith("/500"), true);
  });
});
