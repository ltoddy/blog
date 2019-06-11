import { NextFunction, Request, Response } from "express";

import loggerFactory from "../utils/logger";

const logger = loggerFactory("record.ts");

function recordAllRequest(req: Request, res: Response, next: NextFunction) {
  logger.debug(`${req.ip} visit ${req.route}`);
  next();
}

export {
  recordAllRequest
};
