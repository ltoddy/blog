import { join } from "path";

import { Request, Response, Router } from "express";
import { MongoError } from "mongodb";

import loggerFactory from "../utils/logger";
import Validator from "../utils/validate";
import { signinRequire } from "../middlewares/authenticate";
import Post, { IPostDocument } from "../models/Post";


const logger = loggerFactory("posts.ts");
// url prefix: "/posts"
const posts = Router();

posts.get("/create", signinRequire, (req: Request, res: Response) => {
  return res.render("posts/create", {});
});

posts.post("/create", signinRequire, async (req: Request, res: Response) => {
  const { title, body, wall } = req.fields;
  const validator = new Validator();

  try {
    validator.title(<string>title).done(); // 检查标题
    validator.body(<string>body).done(); // 检查内容
    validator.absoluteUrl(<string>wall).done(); // 检查壁纸url
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect(join(req.baseUrl, "create"));
  }

  try {
    await Post.new(<string>title, <string>body, <string>wall);
    req.flash("info", "发布新文章成功");
    return res.redirect(join(req.baseUrl));
  } catch (error) {
    logger.error(`create post(${title}) failed. ${error.message}`);
    if (error.message.match("dup key")) {
      req.flash("error", "文章重复");
    } else {
      req.flash("error", "创建文章失败，请重试");
    }

    return res.redirect(join(req.baseUrl, "create"));
  }
});

posts.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // 下一步，这里查询改成mongo的aggressive做
    const post = await Post.queryById(id);
    const comments = await post.comments();
    return res.render("posts/post", { post, comments });
  } catch (error) {
    req.flash("error", "未找到文章");
    return res.redirect(join(req.baseUrl));
  }
});

posts.get("/edit/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.queryById(id);
    return res.render("posts/edit", { post });
  } catch (error) {
    logger.error(`can't find (${id}) post: ${error}`);
    req.flash("error", "未找到文章");
    return res.redirect(join(req.baseUrl));
  }
});

posts.post("/edit/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, timestamp, wall, body } = req.fields;

  const validator = new Validator();

  try {
    validator.title(<string>title).done(); // 检查标题
    validator.body(<string>body).done(); // 检查内容
    validator.absoluteUrl(<string>wall).done(); // 检查壁纸url
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect(join(req.baseUrl, "edit", id));
  }

  try {
    // TODO: 优化?
    const post = await Post.queryById(id);
    await post.updateAllFields(<string>title, <string>timestamp, <string>body, <string>wall);
    return res.redirect(join(req.baseUrl, id));
  } catch (error) {
    logger.error(`update post (${id}) failed`);
    req.flash("error", "更新文章失败");
    return res.redirect(join(req.baseUrl, "update", id));
  }
});

posts.get("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.queryById(id);
    return res.render("posts/delete", { post });
  } catch (error) {
    logger.error(`can't find (${id}) post`);
    req.flash("error", "未找到文章");
    return res.redirect(join(req.baseUrl, "delete", id));
  }
});

posts.post("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // TODO: 这里删除一篇post做了两次数据库查询，优化？
    const post = await Post.queryById(id);
    await post.deleteWithComments();
    req.flash("info", "删除成功");
    return res.redirect("/");
  } catch (error) {
    logger.error(`delete (${id}) failed: ${error}`);
    req.flash("error", "删除失败，请重试");
    return res.redirect(join(req.baseUrl, "delete", id));
  }
});

export default posts;
