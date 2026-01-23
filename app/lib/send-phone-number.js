import request from "request";
import config from "config";
import logger from "../utilities/logger.js";
import honeypot from "../utilities/honeypot.js";

function apiOptions(fitnote) {
  return {
    url: `${config.get("api.url")}/mobile`,
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

export function sendPhoneNumber(req, res, next) {
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
    res.status(500).redirect("/500");
  }

  return request(apiOptions(fitnote), apiCallback(req, res, next));
}
