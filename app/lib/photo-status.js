import config from "config";
import request from "request";
import logger from "../utilities/logger.js";

export function photoStatus(req, res) {
  if (typeof req.sessionID == "undefined") {
    res.redirect("/session-timeout");
  }

  const sessionId = req.sessionID;
  const options = {
    url: `${config.get("api.url")}/imagestatus?sessionId=${sessionId}`,
    method: "GET",
    json: true,
  };

  function callback(err, response, body) {
    if (err || response.statusCode !== 200) {
      res.status(200).send("/upload?error=serviceFailed");
    } else {
      logger.info(`Response received: ${response.statusCode}`);
      const { fitnoteStatus } = body;
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
          res.status(200).send(`/upload?error=ocrFailed`);
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
    }
  }

  request(options, callback);
}
