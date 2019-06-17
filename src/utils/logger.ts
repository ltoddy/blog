import { createLogger, format, Logger, transports } from "winston";

const { combine, timestamp, printf } = format;

function loggerFactory(filename: string, solitary: boolean = false): Logger {
  const formatter = printf(({ level, message, _, timestamp }) => {
    return `${timestamp} [${filename}] ${level}: ${message}`;
  });

  if (solitary) {
    return createLogger({
      transports: [
        new (transports.Console)({ level: process.env.NODE_ENV === "production" ? "error" : "debug" }),
        new (transports.File)({ filename: `logs/${filename}.log`, level: "debug" })
      ],
      format: combine(
        timestamp(),
        formatter,
      )
    });
  } else {
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
}

export default loggerFactory;
