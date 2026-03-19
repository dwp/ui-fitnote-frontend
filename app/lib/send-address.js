import axios from "axios";
import config from "config";
import logger from "../utilities/logger.js";
import honeypot from "../utilities/honeypot.js";

function apiOptions(fitnote) {
  return {
    url: `${config.get("api.url")}/address`,
    method: "POST",
    timeout: 240000,
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    data: fitnote,
  };
}

export async function sendAddress(req, res, next) {
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
