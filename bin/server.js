import fs from "fs";
import https from "https";
import config from "config";
import notifyValimate from "valimate-notifier";
import application from "../app/app.js";
import logger from "../app/utilities/logger.js";

const port = config.get("service.port");

if (config.get("service.listenonhttp") === "true") {
  application({
    MOUNT_URL: "/",
  }).listen(port ?? 3000, () => {
    logger.info(`Provider: ${config.get("service.provider")}`);
    logger.info(`Name: ${config.get("service.name")}`);
    logger.info(`Version: ${process.env.npm_package_version}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Service: localhost:${port}`);
    logger.info(`API: ${config.get("api.url")}`);
    logger.info("Listening on http server");
    notifyValimate(true);
  });
} else {
  const credentials = {
    key: fs.readFileSync(config.get("service.key")),
    cert: fs.readFileSync(config.get("service.cert")),
    ca: [
      fs.readFileSync(config.get("service.ca.intermediate")),
      fs.readFileSync(config.get("service.ca.root")),
    ],
    requestCert: true,
    rejectUnauthorized: true,
  };
  const httpsServer = https.createServer(
    credentials,
    application({
      MOUNT_URL: "/",
    }),
  );
  httpsServer.listen(port, () => {
    logger.info(`Provider: ${config.get("service.provider")}`);
    logger.info(`Name: ${config.get("service.name")}`);
    logger.info(`Version: ${process.env.npm_package_version}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Service: localhost:${port}`);
    logger.info(`API: ${config.get("api.url")}`);
    logger.info("Listening on https server");
  });
}

process.on("SIGINT", () => {
  process.kill(process.pid, "SIGTERM");
  process.exit();
});
