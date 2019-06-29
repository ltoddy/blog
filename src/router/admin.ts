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
  try {
    const postIds = <string[]>Object.values(req.fields);
    const postsAndComments = await Post.queryManyWithComments(postIds);
    const data = { data: postsAndComments };
    res.setHeader("Content-Type", "application/download");
    res.setHeader("Content-Disposition", "attachment;filename=dump.json");
    return res.send(data);
  } catch (error) {
    logger.error(`download all posts failed: ${error}`);
    return res.redirect(join(req.baseUrl, "dump"));
  }
});


export default admin;
