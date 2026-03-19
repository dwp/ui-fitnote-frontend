import axios from "axios";
import config from "config";
import logger from "../utilities/logger.js";
import honeypot from "../utilities/honeypot.js";

function apiOptions(fitnote) {
  return {
    url: `${config.get("api.url")}/nino`,
    method: "POST",
    timeout: 240000,
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    data: fitnote,
  };
}

export async function sendNino(req, res, next) {
  if (typeof req.sessionID == "undefined") {
    return res.redirect("/session-timeout");
  }

  const fitnote = {
    sessionId: req.sessionID,
    nino: req.casa.journeyContext.data.nino.nino,
  };

  const emailInput = req.casa.journeyContext.data.nino.emailField;
  const passedHoneypot = honeypot(
    emailInput,
    "BOT: honeypot detected a bot, Nino Page, Email Field",
  );
  if (!passedHoneypot) {
    return res.status(500).redirect("/500");
  }

  await axios(apiOptions(fitnote))
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
