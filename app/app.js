import ExpressJS from "express";
import config from "config";
import { configure } from "@dwp/govuk-casa";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { RedisStore } from "connect-redis";
import Redis from "ioredis";
import { MemoryStore } from "express-session";

import pages from "./definitions/pages.js";
import planFactory from "./definitions/plan.js";
import logger from "./utilities/logger.js";
import { photoStatus } from "./lib/photo-status.js";
import { fileUpload } from "./lib/file-upload.js";
import { complete } from "./lib/complete.js";

import { cookieMiddleware } from "./middleware/cookie-message.js";
import cookiePolicyPost from "./routes/cookie-policy.post.js";
import sessionTimeoutMiddleware from "./middleware/session-timeout.js";

import {
  COOKIE_CONSENT_NAME,
  COOKIE_DETAILS_URL,
  COOKIE_POLICY_URL,
} from "./utilities/constants.js";

const { static: expressStatic } = ExpressJS;

const __dirname = dirname(fileURLToPath(import.meta.url));

let sessionStore;
let redisClient;
const redisPort = config.get("redis.port");
const redisHost = config.get("redis.host");
const redisEncryptionTransit = config.get("redis.encryptionTransit");
const sessionSecret = config.get("sessionInfo.secret");
const sessionTtl = parseInt(config.get("sessionInfo.expiryPeriod"), 10);
const sessionName = config.get("sessionInfo.name");
const disableCsp = config.get("service.disable_csp");
if (redisPort && redisHost) {
  let clusterOptions = {
    redisOptions: { db: 0 },
  };

  if (redisEncryptionTransit) {
    clusterOptions = {
      dnsLookup: (address, callback) => callback(null, address),
      redisOptions: { db: 0, tls: {} },
    };
  }

  redisClient = new Redis.Cluster(
    [
      {
        host: redisHost,
        port: redisPort,
      },
    ],
    clusterOptions,
  );

  let retryCount = 0;
  const REDIS_MAX_RETRY = 20;

  redisClient.on("ready", () => {
    logger.info("Redis connection ready");
  });
  redisClient.on("reconnecting", () => {
    logger.info("Redis reconnecting");
  });
  redisClient.on("end", () => {
    logger.info("Redis connection ended");
  });
  redisClient.on("connect", () => {
    logger.info("Redis connection established");
  });
  redisClient.on("warning", (e) => {
    logger.error("Redis warning: %s", e);
  });
  redisClient.on("close", () => {
    logger.info("Redis connection closed");
  });

  redisClient.on("error", (e) => {
    logger.error(e);
    retryCount++;
    if (retryCount > REDIS_MAX_RETRY) {
      process.exit(1);
    }
  });

  sessionStore = new RedisStore({
    client: redisClient,
    secret: sessionSecret,
    prefix: "syfn:",
    ttl: parseInt(sessionTtl, 10),
    logErrors: (err) => {
      logger.error(err);
    },
  });
} else {
  logger.info("Using default session store");
  sessionStore = new MemoryStore({
    checkPeriod: 86400000,
  });
}

const application = ({ MOUNT_URL = "/" }) => {
  const plan = planFactory();

  const { nunjucksEnv, staticRouter, csrfMiddleware, ancillaryRouter, mount } =
    configure({
      views: [
        resolve(__dirname, "views"),
        resolve(__dirname, "../node_modules/@ministryofjustice/frontend/"),
        resolve(__dirname, "../node_modules/hmrc-frontend"),
      ],
      session: {
        name: sessionName,
        store: sessionStore,
        secret: sessionSecret,
        ttl: sessionTtl,
        secure: config.get("cookieOptions.secure"),
      },
      i18n: {
        dirs: [resolve(__dirname, "locales")],
        locales: ["en", "cy"],
      },
      pages: pages(),
      plan,
    });

  ancillaryRouter.use(
    cookieMiddleware(
      MOUNT_URL,
      COOKIE_CONSENT_NAME,
      COOKIE_POLICY_URL,
      COOKIE_DETAILS_URL,
    ),
  );

  if (disableCsp) {
    logger.info("Disable CSP");
    ancillaryRouter.use((req, res, next) => {
      res.removeHeader("Content-Security-Policy");
      next();
    });
  }

  // Session keep alive, timeout dialog hits this end point to extend session
  ancillaryRouter.get("/session-keep-alive", (req, res) => {
    res.status(200).end();
  });

  // User ended session
  ancillaryRouter.get("/session-ended", (req, res, next) => {
    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      } else {
        return req.session.save(() => res.status(200).redirect("/"));
      }
    });
  });

  const timeoutDialogCountdown = parseInt(
    config.get("sessionInfo.timeoutCountdown"),
    10,
  );
  sessionTimeoutMiddleware(
    ancillaryRouter,
    MOUNT_URL,
    sessionTtl,
    timeoutDialogCountdown,
  );

  nunjucksEnv.addGlobal("govukRebrand", true);
  nunjucksEnv.addGlobal(
    "moj",
    resolve(__dirname, "../node_modules/@ministryofjustice/frontend"),
  );

  staticRouter.use("/assets", expressStatic(resolve(__dirname, "../assets/")));
  staticRouter.all("/assets", (req, res) => res.status(404).send("Not found"));

  // Accessibility statement
  ancillaryRouter.get(`/accessibility-statement`, (req, res) => {
    res.render("pages/accessibility-statement.njk");
  });

  // Cookie policy
  ancillaryRouter.get(COOKIE_POLICY_URL, csrfMiddleware, (req, res) => {
    res.locals.cookiePolicyPage = true;
    res.render("pages/cookie-policy.njk");
  });

  ancillaryRouter.get(COOKIE_DETAILS_URL, csrfMiddleware, (req, res) => {
    res.render("pages/cookie-details.njk");
  });

  // 500 error
  ancillaryRouter.get("/500", (req, res) => {
    res.render("casa/errors/500.njk");
  });

  ancillaryRouter.post(
    COOKIE_POLICY_URL,
    csrfMiddleware,
    cookiePolicyPost(
      COOKIE_CONSENT_NAME,
      MOUNT_URL,
      `${config.get("GTM.domain")}`,
      config.get("cookieOptions.secure"),
    ),
  );

  // Guidance post
  ancillaryRouter.get(`/guidance-post`, (req, res) => {
    res.render("pages/guidance-post.njk");
  });

  ancillaryRouter.get("/photo-status", photoStatus);

  ancillaryRouter.get("/healthcheck", (req, res) => {
    res.status(200).send("okay");
  });

  ancillaryRouter.prependPost("/upload", fileUpload);

  ancillaryRouter.get("/complete", complete);

  ancillaryRouter.use(/^\/$/, (req, res) => {
    res.status(302).redirect("/esa");
  });

  const casaApp = ExpressJS();
  mount(casaApp);

  const app = ExpressJS();
  app.use(MOUNT_URL, casaApp);

  return app;
};

export default application;
