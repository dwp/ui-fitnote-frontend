import { describe, it } from "mocha";
import methodObtainedFields from "../../../../../app/definitions/fields/method-obtained.js";
import {
  expectValidatorToFail,
  expectValidatorToPass,
} from "../../helpers/validator-assertions.js";

describe("Validators: method-obtained", () => {
  describe("field: methodObtained", () => {
    describe("required filter", () => {
      it("should fail required validator if no value is provided", async () => {
        expectValidatorToFail(
          methodObtainedFields(),
          "methodObtained",
          "required",
          undefined,
          {
            summary: "method-obtained:field.methodObtained.empty",
          },
        );
      });

      it("should fail required validator if value is not correct", async () => {
        expectValidatorToFail(
          methodObtainedFields(),
          "methodObtained",
          "required",
          "post",
          {
            summary: "method-obtained:field.methodObtained.empty",
          },
        );
      });

      it("should pass required validator if value is digital", async () => {
        await expectValidatorToPass(
          methodObtainedFields(),
          "methodObtained",
          "required",
          {
            methodObtained: "digital",
          },
        );
      });

      it("should pass required validator if value is paper", async () => {
        await expectValidatorToPass(
          methodObtainedFields(),
          "methodObtained",
          "required",
          {
            methodObtained: "paper",
          },
        );
      });
    });
  });
});
