import { describe, it } from "mocha";
import addressFields from "../../../../../app/definitions/fields/address.js";
import {
  expectValidatorToFail,
  expectValidatorToPass,
} from "../../helpers/validator-assertions.js";

describe("Validators: address", () => {
  describe("field: address", () => {
    describe("required filter", () => {
      it("should fail houseNumber required validator if no value is provided", async () => {
        expectValidatorToFail(
          addressFields(),
          "houseNumber",
          "required",
          undefined,
          {
            summary: "address:field.houseNumber.empty",
          },
        );
      });

      it("should fail postcode required validator if no value is provided", async () => {
        expectValidatorToFail(
          addressFields(),
          "postcode",
          "required",
          undefined,
          {
            summary: "address:field.postcode.empty",
          },
        );
      });

      it("should pass houseNumber required validator if value is provided", async () => {
        await expectValidatorToPass(
          addressFields(),
          "houseNumber",
          "required",
          {
            houseNumber: "123 Home Lane",
          },
        );
      });

      it("should pass postcode required validator if value is provided", async () => {
        await expectValidatorToPass(addressFields(), "postcode", "required", {
          postcode: "B10AA",
        });
      });

      it("should fail postcode regex validator if valid is not valid", async () => {
        expectValidatorToFail(
          addressFields(),
          "postcode",
          "regex",
          {
            postcode: "000000",
          },
          {
            summary: "address:field.postcode.format",
          },
        );
      });

      it("should pass postcode regex validator if value is valid", async () => {
        await expectValidatorToPass(addressFields(), "postcode", "required", {
          postcode: "B10AA",
        });
      });
    });
  });
});
