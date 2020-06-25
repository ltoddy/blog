import { NextFunction, Request, Response } from "express";

import { loggerFactory } from "../utils/logger";


const logger = loggerFactory("access.ts", true);

export default function access(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.ip} visit ${req.url}`);
  return next();
}
