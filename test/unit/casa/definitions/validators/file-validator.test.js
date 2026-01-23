import * as chai from "chai";
import { describe, it } from "mocha";

import {
  uploadValidationErrors,
  FileValidator,
} from "../../../../../app/definitions/validators/file-validator.js";

const { assert } = chai;

describe("file-validator", () => {
  const validator = new FileValidator();

  it("should return size error", () => {
    const result = validator.validate(uploadValidationErrors.SIZE);
    assert.equal(result[0].message, "upload:field.userPhoto.fileSize");
  });

  it("should return file type error", () => {
    const result = validator.validate(uploadValidationErrors.BAD_TYPE);
    assert.equal(result[0].message, "upload:field.userPhoto.fileType");
  });

  it("should return problem error by default", () => {
    const result = validator.validate("");
    assert.equal(result[0].message, "upload:field.userPhoto.problem");
  });

  it("should return empty array when image valid returned", () => {
    const img = {
      name: "myFile.pdf",
      type: "pdf",
      size: "100kb",
    };
    const result = validator.validate(img);
    assert.equal(result.length, 0);
  });
});
