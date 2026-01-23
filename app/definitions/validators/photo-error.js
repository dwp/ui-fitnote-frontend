import { ValidationError } from "@dwp/govuk-casa";

export function photoError(req, res) {
  const { error } = req.query;

  if (
    error === "maxReplay" ||
    error === "ocrFailed" ||
    error === "password" ||
    error === "fileSize" ||
    error === "fileType"
  ) {
    req.casa.journeyContext.setValidationErrorsForPage(req.casa.waypoint, [
      new ValidationError({
        summary: `upload:field.userPhoto.${error}`,
        field: "userPhoto",
        fieldHref: "#f-userPhoto",
      }),
    ]);
    res.locals.photoError = new ValidationError({
      summary: `upload:field.userPhoto.${error}`,
      field: "userPhoto",
      fieldHref: "#f-userPhoto",
    });
  } else {
    const validationError = new ValidationError({
      summary: `upload:field.userPhoto.serviceFailed`,
      field: "userPhoto",
      fieldHref: "#f-userPhoto",
    });
    req.casa.journeyContext.setValidationErrorsForPage(req.casa.waypoint, [
      validationError,
    ]);
    res.locals.photoError = validationError;
  }
}
