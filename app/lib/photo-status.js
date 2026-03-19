import config from "config";
import axios from "axios";
import logger from "../utilities/logger.js";

export async function photoStatus(req, res) {
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
      logger.info(`Response received: ${response.status}`);
      const { fitnoteStatus } = response.data;
      if (fitnoteStatus === "UPLOADED") {
        res.status(200).send(fitnoteStatus);
        return;
      }
      switch (fitnoteStatus) {
        case "SUCCEEDED":
          res.status(200).send("/nino");
          break;
        case "FAILED_IMG_OCR":
        case "FAILED_IMG_OCR_PARTIAL":
          res.status(200).send(`/image-problem`);
          break;
        case "FAILED_IMG_SIZE":
          res.status(200).send(`/upload?error=fileSize`);
          break;
        case "FAILED_IMG_MAX_REPLAY":
          res.status(200).send(`/upload?error=maxReplay`);
          break;
        case "FAILED_IMG_PASSWORD":
          res.status(200).send(`/upload?error=password`);
          break;
        case "FAILED_ERROR":
        case "FAILED_IMG_COMPRESS":
        case "FAILED_IMG_FILE_TYPE":
          res.status(200).send(`/upload?error=fileType`);
          break;
        default:
          res.status(200).send("/upload?error=serviceFailed");
          break;
      }
    })
    .catch((err) => {
      logger.debug(`Error${err}`);
      return res.status(200).send("/upload?error=serviceFailed");
    });
}
