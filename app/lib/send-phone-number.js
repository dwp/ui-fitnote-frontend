import axios from "axios";
import config from "config";
import logger from "../utilities/logger.js";
import honeypot from "../utilities/honeypot.js";

function apiOptions(fitnote) {
  return {
    url: `${config.get("api.url")}/mobile`,
    method: "POST",
    timeout: 240000,
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    data: fitnote,
  };
}

export async function sendPhoneNumber(req, res, next) {
  if (typeof req.sessionID == "undefined") {
    return res.redirect("/session-timeout");
  }

  const fitnote = {
    sessionId: req.sessionID,
    mobileNumber: req.casa.journeyContext.data["text-message"].mobileNumber,
  };

  if (req.casa.journeyContext.data["text-message"].textMessage !== "yes") {
    return next();
  }

  const landlineInput =
    req.casa.journeyContext.data["text-message"].landlineField;
  const passedHoneypot = honeypot(
    landlineInput,
    "BOT: honeypot detected a bot, Text Message Page, Landline Field",
  );
  if (!passedHoneypot) {
    return res.status(500).redirect("/500");
  }

  return await axios(apiOptions(fitnote))
    .then((response) => {
      logger.info(`Response Received: ${response.status}`);
      if (response.status === 200 || response.status === 201) {
        return next();
      } else {
        return res.status(500).redirect("/500");
      }
    })
    .catch((err) => {
      logger.debug(`Error${err}`);
      return res.status(500).redirect("/500");
    });
}
