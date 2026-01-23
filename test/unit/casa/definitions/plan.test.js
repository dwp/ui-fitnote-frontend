import { assert } from "chai";
import { describe, it } from "mocha";
import plan from "../../../../app/definitions/plan.js";

describe("journey", () => {
  describe("plan", () => {
    it("should have the plan present", () => {
      assert.isNotNull(plan());
    });
  });
});
