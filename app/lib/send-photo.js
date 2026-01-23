import rp from "request-promise-native";
import config from "config";
import logger from "../utilities/logger.js";
import honeypot from "../utilities/honeypot.js";

function encodeImage(req) {
  if (typeof req.file !== "undefined") {
    const file = req.file.userPhoto;
    return file.toString("base64");
  }
  return "";
}

function apiUploadOptions(req) {
  return {
    url: `${config.get("api.url")}/photo`,
    method: "POST",
    json: true,
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    agentOptions: {
      keepAlive: true,
    },
    timeout: 240000,
    body: {
      sessionId: req.sessionID,
      image: encodeImage(req),
    },
  };
}

export function sendPhoto(req, res, next) {
  function requestUploadCallback(counter) {
    if (typeof req.sessionID == "undefined") {
      return res.redirect("/session-timeout");
    }

    let count = counter;

    const imageNameInput = req.casa.journeyContext.data.upload.imageNameField;
    const passedHoneypot = honeypot(
      imageNameInput,
      "BOT: honeypot detected a bot, Upload Page, Image Name Field",
    );
    if (!passedHoneypot) {
      res.status(500).redirect("/500");
    }

    rp(apiUploadOptions(req))
      .then((response) => {
        if (response.sessionId != null) {
          logger.info(
            `API call attempts successful on: ${count} ${count > 0 ? "retry" : ""}`,
          );
          logger.info("Submitted image successfully");
          next();
        }
      })
      .catch(() => {
        if (count > 5) {
          logger.error("Failed 5 times");
          res.status(500).redirect("/500");
        } else {
          count += 1;
          setTimeout(
            () => {
              requestUploadCallback(count);
            },
            count * 2 * 1000,
          );
        }
      });
  }

  requestUploadCallback(0);
}
