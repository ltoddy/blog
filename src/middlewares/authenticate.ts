import { Request, Response, NextFunction } from "express";

function signinRequire(req: Request, res: Response, next: NextFunction) {
  // 要求登入状态
  if (!req.session.user) {
    req.flash("error", "未登录");
    return res.redirect("/auth/signin");
  }
  next();
}

function signoutRequire(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    req.flash("error", "已登录");
    return res.redirect("back");
  }
  next();
}

export {
  signinRequire,
  signoutRequire,
};
