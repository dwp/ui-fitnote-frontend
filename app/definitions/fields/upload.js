import { field } from "@dwp/govuk-casa";
import { FileValidator } from "../validators/file-validator.js";

export default () => [
  field("userPhoto").validators([
    FileValidator.make({
      errorMsgFileSize: "upload:field.userPhoto.fileSize",
      errorMsgMimeType: "upload:field.userPhoto.mimeType",
      errorMsgGeneric: "upload:field.userPhoto.problem",
    }),
  ]),
];
