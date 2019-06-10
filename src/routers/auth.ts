import { join } from "path";
import crypto from "crypto";

import { Request, Response, Router } from "express";
import { MongoError } from "mongodb";

import loggerFactory from "../utils/logger";
import Validator from "../utils/validate";
import User, { IUser } from "../models/User";
import { signinRequire, signoutRequire } from "../middlewares/authenticate";
import { SECRET } from "../config";

const logger = loggerFactory("auth.ts");
// url prefix: "/auth"
const auth = Router();

auth.get("/signup", signoutRequire, (req: Request, res: Response) => {
  return res.render("auth/signup");
});

auth.post("/signup", signoutRequire, (req: Request, res: Response) => {
  const { email, username, password, password2 } = req.fields;
  const validator = new Validator();

  // 这很 Golang (函数返回两个值)，不过在这里这种设计我个人认为是比较正确，优雅的。
  // 这里加花括号，是新创建作用域，防止变量名字冲突
  { // 检查邮箱
    const [ok, message]: [boolean, string] = validator.email(<string>email).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "signup"));
    }
  }

  { // 检查用户名
    const [ok, message]: [boolean, string] = validator.username(<string>username).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "signup"));
    }
  }

  { // 检查密码
    const [ok, message]: [boolean, string] = validator.password(<string>password, <string>password2).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "signup"));
    }
  }

  const passwordHash = crypto.createHmac("sha256", SECRET).update(<string>password).digest("hex");
  User.create({ email, username, passwordHash }, function (err: MongoError, user: IUser) {
    if (err) {
      // 目前，在mongo的schema中定义了unique，这里使用字段的unique来判断是否有已经注册的同名用户，这种实现方式目前先待定。
      logger.error(`create user(${username}) failed. ${err.message}`);
      if (err.message.match("dup key")) {
        req.flash("error", "该账号已被注册");
      } else {
        req.flash("error", "创建用户失败，请重试.");
      }
      return res.redirect(join(req.baseUrl, "signup"));
    } else {
      logger.info(`${username} registered success.`);
      req.session.user = user;
      req.flash("info", "注册成功");
      return res.redirect("/");
    }
  });
});

auth.get("/signin", signoutRequire, (req: Request, res: Response) => {
  return res.render("auth/signin");
});


auth.post("/signin", signoutRequire, (req: Request, res: Response) => {
  const { username, password } = req.fields;
  const validator = new Validator();

  { // 检查用户名
    const [ok, message]: [boolean, string] = validator.username(<string>username).result();
    if (!ok) {
      logger.error("error", message);
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "signin"));
    }
  }

  { // 检查密码
    const [ok, message]: [boolean, string] = validator.password(<string>password, <string>password).result();
    if (!ok) {
      logger.error("error", message);
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "signin"));
    }
  }

  const passwordHash = crypto.createHmac("sha256", SECRET).update(<string>password).digest("hex");
  User.findOne({ username }, (err: MongoError, user: IUser) => {
    if (err) {
      return res.redirect(join(req.baseUrl, "signin"));
    }
    if (passwordHash !== user.passwordHash) {
      req.flash("error", "密码不正确");
      return res.redirect(join(req.baseUrl, "signin"));
    }
    req.flash("info", "登录成功");
    req.session.user = user;
    return res.redirect("/");
  });
});

auth.get("/signout", signinRequire, (req: Request, res: Response) => {
  req.session.user = undefined;
  req.flash("info", "登出成功");
  return res.redirect(join(req.baseUrl, "signin"));
});

export default auth;
