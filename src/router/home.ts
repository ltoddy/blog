import { readFile } from "fs";

import { Request, Response, Router } from "express";
import MarkdownIt from "markdown-it";

import Post, { IPostPagination } from "../models/Post";
import { loggerFactory } from "../utils/logger";
import { ABOUT_ME_PATH, POSTS_PER_PAGE } from "../config";

const md = new MarkdownIt();
const logger = loggerFactory("home.ts");
// url prefix: "/"
export const home = Router();

home.get("/", async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string || "0");

  const prevPage = page - 1;
  const nextPage = page + 1;

  try {
    const { posts, hasPrev, hasNext }: IPostPagination = await Post.paginate(page, POSTS_PER_PAGE);
    return res.render("index", { posts, prevPage, nextPage, hasPrev, hasNext });
  } catch (error) {
    logger.error(`query posts failed: ${error}`);
    return res.status(404).render("404");
  }
});

home.get("/about", (req: Request, res: Response) => {
  readFile(ABOUT_ME_PATH, (err: NodeJS.ErrnoException, data: Buffer) => {
    if (err) {
      return res.render("about", { aboutMe: "正在建设中" });
    } else {
      const content = data.toString();
      const aboutMe = md.render(content);
      return res.render("about", { aboutMe });
    }
  });
});

home.get("/timeline", (req: Request, res: Response) => {
  return res.render("timeline");
});

home.get("/faq", (req: Request, res: Response) => {
  // TODO
});
