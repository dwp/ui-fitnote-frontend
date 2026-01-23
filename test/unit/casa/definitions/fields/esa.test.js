import { describe, it } from "mocha";
import esaFields from "../../../../../app/definitions/fields/esa.js";
import {
  expectValidatorToFail,
  expectValidatorToPass,
} from "../../helpers/validator-assertions.js";

describe("Validators: esa", () => {
  describe("field: esa", () => {
    describe("required filter", () => {
      it("should fail required validator if no value is provided", async () => {
        await expectValidatorToFail(esaFields(), "esa", "required", undefined, {
          summary: "esa:field.esa.empty",
        });
      });

      it("should fail required validator if value is not correct", async () => {
        await expectValidatorToFail(esaFields(), "esa", "required", "maybe", {
          summary: "esa:field.esa.empty",
        });
      });

      it("should pass required validator if value is yes", async () => {
        await expectValidatorToPass(esaFields(), "esa", "required", {
          esa: "yes",
        });
      });

      it("should pass required validator if value is no", async () => {
        await expectValidatorToPass(esaFields(), "esa", "required", {
          esa: "no",
        });
      });
    });
  });
});
