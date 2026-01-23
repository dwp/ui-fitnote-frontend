import os from "os";
import pino from "pino";
import config from "config";

export default pino({
  level: config.get("LOG_LEVEL") || "info",
  messageKey: "message",
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  time: () => `,"time":"${new Date().toISOString()}"`,
  base: {
    pid: process.pid,
    hostname: os.hostname(),
  },
  redact: {
    paths: ["req.headers", "res.headers"],
    remove: true,
  },
});
