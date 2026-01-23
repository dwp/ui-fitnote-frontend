import request from "request";
import config from "config";
import logger from "../utilities/logger.js";
import honeypot from "../utilities/honeypot.js";

function apiOptions(fitnote) {
  return {
    url: `${config.get("api.url")}/address`,
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

export function sendAddress(req, res, next) {
  if (typeof req.sessionID == "undefined") {
    return res.redirect("/session-timeout");
  }

  const houseNumber = req.casa.journeyContext.data.address.houseNumber.trim();
  const postcode = req.casa.journeyContext.data.address.postcode.trim();

  const fitnote = {
    sessionId: req.sessionID,
    houseNameOrNumber: houseNumber,
    postcode: postcode,
  };

  const countyInput = req.casa.journeyContext.data.address.countyField;
  const passedHoneypot = honeypot(
    countyInput,
    "BOT: honeypot detected a bot, Address Page, County Field",
  );
  if (!passedHoneypot) {
    res.status(500).redirect("/500");
  }

  return request(apiOptions(fitnote), apiCallback(req, res, next));
}
