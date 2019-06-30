import fs from "fs";
import { join } from "path";

import { Request, Response, Router } from "express";
import { File } from "formidable";

import Post, { IPostAndComments, IPostDocument } from "../models/Post";
import Comment, { ICommentDocument } from "../models/Comment";
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

admin.get("/load", signinRequire, async (req: Request, res: Response) => {
  return res.render("admin/load");
});

admin.post("/load", signinRequire, async (req: Request, res: Response) => {
  try {
    const dump: File = req.files.dump;
    const dumpJson: Buffer = fs.readFileSync(dump.path);
    const data: { data: IPostAndComments[] } = JSON.parse(dumpJson.toString());
    const postsAndComments: IPostAndComments[] = data.data;

    const posts: IPostDocument[] = [];
    const comments: ICommentDocument[] = [];
    for (const postAndComments of postsAndComments) { // TODO: lodash?
      posts.push(postAndComments.post);
      comments.push(...postAndComments.comments);
    }

    await Promise.all([
      ...posts.map((data: IPostDocument) => Post.fromJson(data)),
      ...comments.map((data: ICommentDocument) => Comment.fromJson(data)),
    ]);

    req.flash("info", "上传成功");
    return res.redirect(join(req.baseUrl, "load"));
  } catch (error) {
    req.flash("error", "上传数据异常");
    logger.error(`load file failed: ${error}`);
    return res.redirect(join(req.baseUrl, "load"));
  }
});

export default admin;
