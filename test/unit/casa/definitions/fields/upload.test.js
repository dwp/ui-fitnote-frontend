import uploadFields from "../../../../../app/definitions/fields/upload.js";
import { describe } from "mocha";

import { assert } from "chai";

describe("Validators: upload", () => {
  describe("field: userPhoto", () => {
    const fields = uploadFields();
    const config = fields[0].getValidators()[0].config;
    assert.isNotNull(fields);
    assert.equal(config.errorMsgFileSize, "upload:field.userPhoto.fileSize");
    assert.equal(config.errorMsgMimeType, "upload:field.userPhoto.mimeType");
    assert.equal(config.errorMsgGeneric, "upload:field.userPhoto.problem");
  });
});
