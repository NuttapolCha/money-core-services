import { createLogger, format, transports } from "winston";
import { config } from "./config";

const logFormats = [
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.errors({ stack: true }),
  format.splat(),
  format.json(),
];

if (config.nodeEnv !== "production") {
  logFormats.push(format.colorize(), format.simple());
}

export const logger = createLogger({
  level: "info",
  format: format.combine(...logFormats),
  defaultMeta: { app: config.appName },
  transports: [new transports.Console()],
});
