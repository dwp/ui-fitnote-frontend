import request from "request";
import config from "config";
import logger from "../utilities/logger.js";

async function submitDeclaration(req, res) {
  const logType = logger.child({ widget: "confirmation" });
  const fitnote = {
    sessionId: req.sessionID,
    accepted: true,
  };

  const options = {
    url: `${config.get("api.url")}/declaration`,
    method: "POST",
    json: true,
    timeout: 240000,
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    body: fitnote,
  };

  function processRequest() {
    logType.info("Submitted form data successfully");
    res.redirect("/complete");
  }

  function handleFormError(err, errorMsg) {
    logType.fatal(`${errorMsg}:${err}`);
    res.status(500).redirect("/500");
  }

  function callback(err, response, body) {
    if (!err) {
      logType.info(`Response Received: ${response.statusCode}`);
      switch (response.statusCode) {
        case 200:
        case 201:
          processRequest();
          break;
        case 400:
          handleFormError(body, "Problem with submitted form data");
          break;
        default:
          handleFormError(body, "API not responding ");
      }
    } else {
      handleFormError(err, "API not responding ");
    }
  }

  if (typeof req.sessionID !== "undefined") {
    request(options, callback);
  } else {
    return res.redirect("/session-timeout");
  }
}

export default submitDeclaration;
