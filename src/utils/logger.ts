import { createLogger, format, Logger, transports } from "winston";

const { combine, timestamp, printf } = format;

export default function loggerFactory(filename: string): Logger {
  const formatter = printf(({ level, message, _, timestamp }) => {
    return `${timestamp} [${filename}] ${level}: ${message}`;
  });

  return createLogger({
    transports: [
      new (transports.Console)({ level: process.env.NODE_ENV === "production" ? "error" : "debug" }),
      new (transports.File)({ filename: `logs/blog.log`, level: "debug" })
    ],
    format: combine(
      timestamp(),
      formatter,
    )
  });
}
