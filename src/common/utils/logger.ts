import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;
import { config } from "../../config/app.config";
import "winston-daily-rotate-file";

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.DailyRotateFile({
      dirname: "logs",
      filename: "%DATE%-app.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "15d",
    }),
  ],
});

export default logger;
