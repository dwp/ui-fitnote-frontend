import * as chai from "chai";
import { describe, it } from "mocha";
import chaiAsPromised from "chai-as-promised";
import pages from "../../../../app/definitions/pages.js";

chai.use(chaiAsPromised);

const { assert } = chai;

function getPage(waypointId) {
  return pages().find((page) => page.waypoint === waypointId);
}

describe("journey pages", () => {
  describe("esa", () => {
    it("should have the page present", () => {
      const page = getPage("esa");
      assert.isNotNull(page);
      assert.isNotNull(page.fields);
      assert.equal(page.view, "pages/esa.njk");
    });
  });
  describe("no-esa", () => {
    it("should have the page present", () => {
      const page = getPage("no-esa");
      assert.isNotNull(page);
      assert.equal(page.view, "pages/no-esa.njk");
    });
  });
  describe("method-obtained", () => {
    it("should have the page present", () => {
      const page = getPage("method-obtained");
      assert.isNotNull(page);
      assert.isNotNull(page.fields);
      assert.equal(page.view, "pages/method-obtained.njk");
    });
  });
  describe("guidance-digital", () => {
    it("should have the page present", () => {
      const page = getPage("guidance-digital");
      assert.isNotNull(page);
      assert.equal(page.view, "pages/guidance-digital.njk");
    });
  });
  describe("guidance-paper", () => {
    it("should have the page present", () => {
      const page = getPage("guidance-paper");
      assert.isNotNull(page);
      assert.equal(page.view, "pages/guidance-paper.njk");
    });
  });
});
