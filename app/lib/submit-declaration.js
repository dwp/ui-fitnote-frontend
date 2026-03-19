import axios from "axios";
import config from "config";
import logger from "../utilities/logger.js";

async function submitDeclaration(req, res) {
  const logType = logger.child({ widget: "confirmation" });
  const fitnote = {
    sessionId: req.sessionID,
    accepted: true,
  };

  function apiOptions() {
    return {
      url: `${config.get("api.url")}/declaration`,
      method: "POST",
      timeout: 240000,
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
      data: fitnote,
    };
  }

  function processRequest() {
    logType.info("Submitted form data successfully");
    res.redirect("/complete");
  }

  function handleFormError(err, errorMsg) {
    logType.fatal(`${errorMsg}:${err}`);
    res.status(500).redirect("/500");
  }

  if (typeof req.sessionID !== "undefined") {
    return await axios(apiOptions())
      .then((response) => {
        logType.info(`Response Received: ${response.status}`);
        switch (response.status) {
          case 200:
          case 201:
            processRequest();
            break;
          case 400:
            handleFormError(fitnote, "Problem with submitted form data");
            break;
          default:
            handleFormError(fitnote, "API not responding ");
        }
      })
      .catch((err) => {
        logType.debug(`Error${err}`);
        handleFormError(err, "API not responding ");
      });
  } else {
    return res.redirect("/session-timeout");
  }
}

export default submitDeclaration;
