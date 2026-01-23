import { describe, it } from "mocha";
import textMessageFields from "../../../../../app/definitions/fields/text-message.js";
import {
  expectValidatorToFail,
  expectValidatorToPass,
} from "../../helpers/validator-assertions.js";

describe("Validators: text-message", () => {
  describe("field: textMessage", () => {
    describe("required filter", () => {
      it("should fail textMessage required validator if no value is provided", async () => {
        expectValidatorToFail(
          textMessageFields(),
          "textMessage",
          "required",
          undefined,
          {
            summary: "text-message:field.mobileNumber.empty",
          },
        );
      });

      it("should fail textMessage required validator if value is not correct", async () => {
        expectValidatorToFail(
          textMessageFields(),
          "textMessage",
          "required",
          "maybe",
          {
            summary: "text-message:field.mobileNumber.empty",
          },
        );
      });

      it("should pass textMessage required validator if value is yes", async () => {
        await expectValidatorToPass(
          textMessageFields(),
          "textMessage",
          "required",
          {
            textMessage: "yes",
          },
        );
      });

      it("should pass textMessage required validator if value is no", async () => {
        await expectValidatorToPass(
          textMessageFields(),
          "textMessage",
          "required",
          {
            textMessage: "no",
          },
        );
      });

      it("should fail mobileNumber required validator if no value is provided", async () => {
        expectValidatorToFail(
          textMessageFields(),
          "mobileNumber",
          "required",
          {
            textMessage: "yes",
            mobileNumber: undefined,
          },
          {
            summary: "text-message:field.mobileNumber.format",
          },
        );
      });

      it("should fail mobileNumber regex validator if no value is provided", async () => {
        expectValidatorToFail(
          textMessageFields(),
          "mobileNumber",
          "regex",
          {
            textMessage: "yes",
            mobileNumber: "0",
          },
          {
            summary: "text-message:field.mobileNumber.format",
          },
        );
      });

      it("should pass textMessage regex validator if value is valid (+44)", async () => {
        await expectValidatorToPass(
          textMessageFields(),
          "textMessage",
          "required",
          {
            textMessage: "yes",
            mobileNumber: "+447362342247",
          },
        );
      });

      it("should pass textMessage regex validator if value is valid", async () => {
        await expectValidatorToPass(
          textMessageFields(),
          "textMessage",
          "required",
          {
            textMessage: "yes",
            mobileNumber: "07362342247",
          },
        );
      });
    });
  });
});
