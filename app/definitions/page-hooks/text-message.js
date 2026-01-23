import { sendPhoneNumber } from "../../lib/send-phone-number.js";

export default () => {
  return [
    {
      hook: "postvalidate",
      middleware: async (req, res, next) => {
        const errors = req.casa.journeyContext.getValidationErrorsForPage(
          req.casa.waypoint,
        );

        if (req.casa.journeyContext.data["text-message"].textMessage === "no") {
          delete req.casa.journeyContext.data["text-message"].mobileNumber;
        }

        if (errors && errors.length > 0) {
          next();
        } else {
          await sendPhoneNumber(req, res, next);
        }
      },
    },
  ];
};
