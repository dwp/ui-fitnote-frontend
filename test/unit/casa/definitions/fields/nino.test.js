import { describe, it } from "mocha";
import ninoFields from "../../../../../app/definitions/fields/nino.js";
import {
  expectValidatorToFail,
  expectValidatorToPass,
} from "../../helpers/validator-assertions.js";

describe("Validators: nino", () => {
  describe("field: nino", () => {
    describe("required filter", () => {
      it("should fail required validator if no value is provided", async () => {
        await expectValidatorToFail(
          ninoFields(),
          "nino",
          "required",
          undefined,
          {
            summary: "nino:field.nino.empty",
          },
        );
      });

      it("should pass required validator if value is present", async () => {
        await expectValidatorToPass(ninoFields(), "nino", "required", {
          nino: "PB123456B",
        });
      });

      it("should pass regex validator if value is valid pattern", async () => {
        await expectValidatorToPass(ninoFields(), "nino", "regex", {
          nino: "PB123456B",
        });
      });

      it("should fail regex validator if value is not valid pattern", async () => {
        await expectValidatorToFail(
          ninoFields(),
          "nino",
          "regex",
          {
            nino: "QQ123456B",
          },
          {
            summary: "nino:field.nino.format",
          },
        );
      });
    });
  });
});
