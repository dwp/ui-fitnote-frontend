import { sendPhoto } from "../../lib/send-photo.js";
import { photoError } from "../validators/photo-error.js";

export default () => {
  return [
    {
      hook: "prerender",
      middleware: (req, res, next) => {
        if (req.query.error) {
          photoError(req, res);
        }
        next();
      },
    },
    {
      hook: "postvalidate",
      middleware: async (req, res, next) => {
        const errors = req.casa.journeyContext.getValidationErrorsForPage(
          req.casa.waypoint,
        );

        res.locals.photoError = errors[0];

        if (!req.session.uploadCount) {
          req.session.uploadCount = 1;
        } else {
          req.session.uploadCount++;
        }

        if (errors && errors.length > 0) {
          next();
        } else {
          await sendPhoto(req, res, next);
        }
      },
    },
  ];
};
