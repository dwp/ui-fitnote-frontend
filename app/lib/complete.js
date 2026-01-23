import { endSession } from "@dwp/govuk-casa";
import logger from "../utilities/logger.js";

export function complete(req, res) {
  endSession(req, () => {
    try {
      res.render("pages/complete.njk");
    } catch (err) {
      logger.error("Session ending error - " + err);
      res.status(500).redirect("/500");
    }
  });
}
