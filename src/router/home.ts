import { Request, Response, Router } from "express";

import Post from "../models/Post";
import loggerFactory from "../utils/logger";
import { POSTS_PER_PAGE } from "../config";

const logger = loggerFactory("home.ts");
// url prefix: "/"
const home = Router();

home.get("/", async (req: Request, res: Response) => {
  let { page, perPage } = req.query;
  page = Number.parseInt(page || "0");
  perPage = Number.parseInt(perPage || POSTS_PER_PAGE);

  const prevPage = page - 1;
  const nextPage = page + 1;

  try {
    const posts = await Post.paginate(page, POSTS_PER_PAGE);
    return res.render("index", { posts, prevPage, nextPage });
  } catch (error) {
    logger.error(`query posts failed: ${error}`);
    return res.status(500).end();
  }
});

home.get("/about", (req: Request, res: Response) => {
  return res.render("about");
});

home.get("/faq", (req: Request, res: Response) => {
  // TODO
});

export default home;
