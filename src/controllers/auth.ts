import { join } from "path";
import crypto from "crypto";

import { Request, Response, Router } from "express";
import loggerFactory from "../utils/logger";

import User from "../models/User";
import { SECRET } from "../config";

const logger = loggerFactory("auth.ts");
// url prefix: "/auth"
const auth = Router();

auth.get("/signup", (req: Request, res: Response) => {
  res.render("auth/signup");
});

auth.post("/signup", (req: Request, res: Response) => {
  const { email, username, password, password2 } = req.fields;
  try {
    if (!email) {
      req.flash("error", "邮箱不能为空!");
      res.redirect(join(req.baseUrl, "signup"));
    }
    if (!username) {
      req.flash("error", "用户名不能为空!");
      res.redirect(join(req.baseUrl, "signup"));
    }
    if (!password && !password2 && password !== password2) {
      req.flash("error", "两次密码要求一致并且不能为空!");
      res.redirect(join(req.baseUrl, "signup"));
    }

    const passwordHash = crypto.createHmac("sha256", SECRET).update(<string>password).digest("hex");
    User.create({ email, username, passwordHash }, function (err: Error) {
      if (err) {
        throw new Error(`create user(${username}) error.`);
      }
      logger.info(`${username} registered.`);
    });

    res.statusCode = 201; // TODO: consider this status code, 201 is right for create user, but there have to redirect.
    res.redirect("/");
  } catch (err) {
    logger.error(err.message);
    res.redirect(join(req.baseUrl, "signup"));
  }
});

auth.get("/signin", (req: Request, res: Response) => {
  res.send("登录");
});

auth.post("/signin", (req: Request, res: Response) => {
  res.redirect(join(req.baseUrl, "signin"));
});

auth.post("/signout", (req: Request, res: Response) => {
  // 登出成功
  res.redirect(join(req.baseUrl, "signin"));
});

export default auth;
