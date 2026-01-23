import { sendAddress } from "../../lib/send-address.js";

export default () => {
  return [
    {
      hook: "prevalidate",
      middleware: (req, res, next) => {
        const address = req.casa.journeyContext.data["address"];
        address.oldPostcode = address.postcode;
        address.postcode = address.postcode
          .toUpperCase()
          .replace(/[\s|-]/g, "");

        next();
      },
    },
    {
      hook: "postvalidate",
      middleware: async (req, res, next) => {
        const address = req.casa.journeyContext.data["address"];
        const errors = req.casa.journeyContext.getValidationErrorsForPage(
          req.casa.waypoint,
        );

        if (errors && errors.length > 0) {
          address.postcode = address.oldPostcode;
          next();
        } else {
          await sendAddress(req, res, next);
          address.postcode = address.oldPostcode;
        }
      },
    },
  ];
};
