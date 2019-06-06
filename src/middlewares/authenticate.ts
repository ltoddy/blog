import { Request, Response, NextFunction } from "express";

function signinRequire(req: Request, res: Response, next: NextFunction) {
  // 要求登入状态
  next();
}

function signoutRequire(req: Request, res: Response, next: NextFunction) {
  // 要求登出状态
  next();
}

export {
  signinRequire,
  signoutRequire,
};
