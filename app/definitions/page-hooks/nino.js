import { sendNino } from "../../lib/send-nino.js";

export default () => {
  return [
    {
      hook: "prevalidate",
      middleware: (req, res, next) => {
        const nino = req.casa.journeyContext.data["nino"];
        nino.oldValue = nino.nino;
        nino.nino = nino.nino.toUpperCase().replace(/[\s|-]/g, "");

        next();
      },
    },
    {
      hook: "postvalidate",
      middleware: async (req, res, next) => {
        const nino = req.casa.journeyContext.data["nino"];
        const errors = req.casa.journeyContext.getValidationErrorsForPage(
          req.casa.waypoint,
        );

        if (errors && errors.length > 0) {
          res.locals.ninoError = errors[0];
          nino.nino = nino.oldValue;
          next();
        } else {
          await sendNino(req, res, next);
          nino.nino = nino.oldValue;
        }
      },
    },
  ];
};
