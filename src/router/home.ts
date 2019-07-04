import { Request, Response, Router } from "express";

import Post, { IPostPagination } from "../models/Post";
import loggerFactory from "../utils/logger";
import { POSTS_PER_PAGE } from "../config";

const logger = loggerFactory("home.ts");
// url prefix: "/"
const home = Router();

home.get("/", async (req: Request, res: Response) => {
  let { page } = req.query;
  page = Number.parseInt(page || "0");

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
  return res.render("about");
});

home.get("/faq", (req: Request, res: Response) => {
  // TODO
});

export default home;
