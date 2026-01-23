import { ValidatorFactory, ValidationError } from "@dwp/govuk-casa";

export const uploadValidationErrors = {
  SIZE: "size",
  BAD_TYPE: "badType",
  PROBLEM: "problem",
};

export class FileValidator extends ValidatorFactory {
  name = "fileValidator";

  validate(fieldValue = "") {
    if (
      typeof fieldValue === "object" &&
      fieldValue.name &&
      fieldValue.type &&
      fieldValue.size
    ) {
      return [];
    }

    let errorMsg = "upload:field.userPhoto.problem";

    switch (fieldValue) {
      case uploadValidationErrors.SIZE:
        errorMsg = "upload:field.userPhoto.fileSize";
        break;
      case uploadValidationErrors.BAD_TYPE:
        errorMsg = "upload:field.userPhoto.fileType";
        break;
      default:
        errorMsg = "upload:field.userPhoto.problem";
    }

    return [ValidationError.make({ errorMsg })];
  }
}
