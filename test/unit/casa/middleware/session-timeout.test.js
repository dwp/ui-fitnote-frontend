import { expect } from "chai";
import { describe, it } from "mocha";
import sessionTimeout from "../../../../app/middleware/session-timeout.js";

describe("session-timeout", () => {
  const app = {
    prependUse(path, mw) {
      this.path = path;
      this.mw = mw;
    },
  };
  it("should add a middleware function", () => {
    sessionTimeout(app, "/");
    expect(app.mw).to.be.an.instanceOf(Function);
  });

  it("should set routing path", () => {
    sessionTimeout(app, "/", 60, 30);
    expect(app.path).to.equal("/");
  });

  it("should add timeoutDialog to res.locals", () => {
    const req = {};
    const res = {
      locals: {},
    };

    sessionTimeout(app, "/", 60, 30);

    app.mw(req, res, () => {});
    expect(res.locals.timeoutDialog)
      .to.have.property("keepAliveUrl")
      .that.equals("/session-keep-alive");
    expect(res.locals.timeoutDialog)
      .to.have.property("signOutUrl")
      .that.equals("https://www.gov.uk/send-fit-note");
    expect(res.locals.timeoutDialog)
      .to.have.property("timeoutUrl")
      .that.equals("/session-timeout");
    expect(res.locals.timeoutDialog)
      .to.have.property("countdown")
      .that.equals(30);
    expect(res.locals.timeoutDialog)
      .to.have.property("timeout")
      .that.equals(60);
  });
});
