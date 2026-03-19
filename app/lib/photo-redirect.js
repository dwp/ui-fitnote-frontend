import config from "config";
import axios from "axios";
import logger from "../utilities/logger.js";

export async function photoRedirect(req, res, next) {
  if (typeof req.sessionID == "undefined") {
    return res.redirect("/session-timeout");
  }

  const sessionId = req.sessionID;

  function apiOptions() {
    return {
      url: `${config.get("api.url")}/imagestatus?sessionId=${sessionId}`,
      method: "GET",
    };
  }

  await axios(apiOptions())
    .then((response) => {
      logger.info(`Response Received: ${response.status}`);
      const { fitnoteStatus } = response.data;
      if (
        fitnoteStatus === "FAILED_IMG_OCR" ||
        fitnoteStatus === "FAILED_IMG_OCR_PARTIAL"
      ) {
        req.casa.journeyContext.data["photo-audit"] = {
          photoAudit: "image-problem",
        };

        if (response.data.image) {
          req.session.fitnoteImg = response.data.image;
        }

        if (response.data.visibleRegion) {
          req.session.visibleRegion = response.data.visibleRegion;
        }
      }
      if (
        fitnoteStatus !== "SUCCEEDED" &&
        fitnoteStatus !== "FAILED_IMG_OCR" &&
        fitnoteStatus !== "FAILED_IMG_OCR_PARTIAL"
      ) {
        return res.redirect("/upload?error=serviceFailed");
      }
      next();
    })
    .catch((err) => {
      logger.debug(`Error${err}`);
      return res.status(200).send("/upload?error=serviceFailed");
    });
}
