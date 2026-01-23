import config from "config";
import request from "request";
import logger from "../utilities/logger.js";

export function photoRedirect(req, res) {
  if (typeof req.sessionID == "undefined") {
    return res.redirect("/session-timeout");
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
      if (fitnoteStatus !== "SUCCEEDED") {
        res.redirect("/upload?error=serviceFailed");
      }
    }
  }

  request(options, callback);
}
