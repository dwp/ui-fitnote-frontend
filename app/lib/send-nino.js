import request from "request";
import config from "config";
import logger from "../utilities/logger.js";
import honeypot from "../utilities/honeypot.js";

function apiOptions(fitnote) {
  return {
    url: `${config.get("api.url")}/nino`,
    method: "POST",
    json: true,
    timeout: 240000,
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    body: fitnote,
  };
}

function apiCallback(req, res, next) {
  return function callback(err, response) {
    if (!err) {
      logger.info(`Response Received: ${response.statusCode}`);
      if (response.statusCode === 200 || response.statusCode === 201) {
        next();
      } else {
        res.status(500).redirect("/500");
      }
    } else {
      logger.debug(`Error${err}`);
      res.status(500).redirect("/500");
    }
  };
}

export function sendNino(req, res, next) {
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
    res.status(500).redirect("/500");
  }

  return request(apiOptions(fitnote), apiCallback(req, res, next));
}
