import { Request, Response, Router } from "express";

import Post from "../models/Post";
import loggerFactory from "../utils/logger";

const logger = loggerFactory("home.ts");
// url prefix: "/"
const home = Router();

home.get("/", async (req: Request, res: Response) => {
  try {
    const allPosts = await Post.queryAll();
    return res.render("index", { posts: allPosts });
  } catch (e) {
    logger.error(`query all posts failed: ${e}`);
    return res.status(500).end();
  }
});

home.get("/about", (req: Request, res: Response) => {
  return res.render("about");
});

home.get("/faq", (req: Request, res: Response) => {
});

export default home;
