import { join } from "path";

import { Request, Response, Router } from "express";

import Post from "../models/Post";
import { signinRequire } from "../middlewares/authenticate";
import loggerFactory from "../utils/logger";

const logger = loggerFactory("admin.ts");
// url prefix: "/admin"
const admin = Router();

admin.get("/dump", signinRequire, async (req: Request, res: Response) => {
  try {
    const posts = await Post.queryAll();
    return res.render("admin/dump", { posts });
  } catch (error) {
    logger.error(`query all posts failed: ${error}`);
    return res.render("admin/dump");
  }
});

admin.post("/dump", signinRequire, async (req: Request, res: Response) => {
  const postIds = Object.values(req.fields);
  console.log("postIds: ", postIds);
  // TODO
  return res.redirect(join(req.baseUrl, "dump"));
});


export default admin;
