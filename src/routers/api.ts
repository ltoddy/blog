import crypto from "crypto";

import { Request, Response, Router } from "express";
import { Document } from "mongoose";

import { SECRET } from "../config";
import User from "../models/User";
import loggerFactory from "../utils/logger";

const logger = loggerFactory("api.ts");

// url prefix: "/api"
const api = Router();

// only blog owner can known how to use this api :).
api.post("/createUser", async (req: Request, res: Response) => {
  const { email, username, name, password, secret } = req.body;
  logger.info(`createUser: ${req.body}`);
  logger.info(email, username, name, password, secret);

  if (secret !== SECRET) {
    res.status(403);
  }

  User.find({ email: email }, function (err, user) {
    if (err) {
      logger.error(`find user from mongo failed. ${err}`);
      res.status(501);
    } else if (user) {
      // register only one user for all time.
      logger.info("duplicate register user.");
      res.status(409);
    } else {
      const passwordHash = crypto.createHmac("sha256", SECRET).update(password).digest("hex");
      logger.info(`passwordHash: ${passwordHash}`);

      const user = new User({ email, username, passwordHash, name });
      res.status(201);
      user.save(function (err, u: Document) {
        if (err) {
          logger.error(`save user to mongo failed. ${err}`);
        }
      });
    }
  });
});

api.get("/posts/:id", (req: Request, res: Response) => {

});

api.get("/posts", (req: Request, res: Response) => {

});

export default api;
