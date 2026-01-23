import { assert } from "chai";
import { describe, it } from "mocha";

import { photoError } from "../../../../../app/definitions/validators/photo-error.js";

describe("photo-error", () => {
  const req = {
    casa: {
      waypoint: "upload",
      journeyContext: {
        setValidationErrorsForPage: () => {},
      },
    },
    query: {
      error: "maxReplay",
    },
  };

  const res = {
    locals: {},
  };

  it("should return maxReplay error", () => {
    photoError(req, res);
    assert.isNotNull(res.locals.photoError);
    assert.equal(
      res.locals.photoError.summary,
      "upload:field.userPhoto.maxReplay",
    );
    assert.equal(
      res.locals.photoError.message,
      "upload:field.userPhoto.maxReplay",
    );
    assert.equal(res.locals.photoError.field, "userPhoto");
  });

  it("should return ocrFailed error", () => {
    req.query.error = "ocrFailed";
    photoError(req, res);
    assert.isNotNull(res.locals.photoError);
    assert.equal(
      res.locals.photoError.summary,
      "upload:field.userPhoto.ocrFailed",
    );
    assert.equal(
      res.locals.photoError.message,
      "upload:field.userPhoto.ocrFailed",
    );
    assert.equal(res.locals.photoError.field, "userPhoto");
  });

  it("should return password error", () => {
    req.query.error = "password";
    photoError(req, res);
    assert.isNotNull(res.locals.photoError);
    assert.equal(
      res.locals.photoError.summary,
      "upload:field.userPhoto.password",
    );
    assert.equal(
      res.locals.photoError.message,
      "upload:field.userPhoto.password",
    );
    assert.equal(res.locals.photoError.field, "userPhoto");
  });

  it("should return fileSize error", () => {
    req.query.error = "fileSize";
    photoError(req, res);
    assert.isNotNull(res.locals.photoError);
    assert.equal(
      res.locals.photoError.summary,
      "upload:field.userPhoto.fileSize",
    );
    assert.equal(
      res.locals.photoError.message,
      "upload:field.userPhoto.fileSize",
    );
    assert.equal(res.locals.photoError.field, "userPhoto");
  });

  it("should return fileType error", () => {
    req.query.error = "fileType";
    photoError(req, res);
    assert.isNotNull(res.locals.photoError);
    assert.equal(
      res.locals.photoError.summary,
      "upload:field.userPhoto.fileType",
    );
    assert.equal(
      res.locals.photoError.message,
      "upload:field.userPhoto.fileType",
    );
    assert.equal(res.locals.photoError.field, "userPhoto");
  });

  it("should return serviceFailed error", () => {
    req.query.error = "serviceFailed";
    photoError(req, res);
    assert.isNotNull(res.locals.photoError);
    assert.equal(
      res.locals.photoError.summary,
      "upload:field.userPhoto.serviceFailed",
    );
    assert.equal(
      res.locals.photoError.message,
      "upload:field.userPhoto.serviceFailed",
    );
    assert.equal(res.locals.photoError.field, "userPhoto");
  });
});
