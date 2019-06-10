import { join } from "path";

import { Request, Response, Router } from "express";
import { MongoError } from "mongodb";

import loggerFactory from "../utils/logger";
import Validator from "../utils/validate";
import { signinRequire } from "../middlewares/authenticate";
import Post, { IPost } from "../models/Post";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();
const logger = loggerFactory("posts.ts");
// url prefix: "/posts"
const posts = Router();

posts.get("/", (req: Request, res: Response) => {
  Post.find((err: MongoError, posts: IPost[]) => {
    return res.render("posts/index", { posts });
  });
});

posts.get("/create", signinRequire, (req: Request, res: Response) => {
  return res.render("posts/create");
});

posts.post("/create", signinRequire, (req: Request, res: Response) => {
  const { title, body } = req.fields;
  const validator = new Validator();

  { // 检查标题
    const [ok, message] = validator.title(<string>title).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "create"));
    }
  }

  { // 检查内容
    const [ok, message] = validator.body(<string>body).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "create"));
    }
  }

  const htmlBody = md.render(<string>body);
  Post.create({ title, body, htmlBody }, (err: MongoError, post: IPost) => {
    if (err) {
      logger.error(`create post(${title}) failed. ${err.message}`);
      if (err.message.match("dup key")) {
        req.flash("error", "文章重复");
      } else {
        req.flash("error", "创建文章失败，请重试");
      }
      return res.redirect(join(req.baseUrl, "create"));
    } else {
      logger.info(`${title} 发布新文章成功`);
      req.flash("info", "发布新文章成功");
      return res.redirect(join(req.baseUrl));
    }
  });
});

posts.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  Post.findById(id, (err: MongoError, post: IPost) => {
    if (err) {
      logger.error(`can't find (${id}) post`);
      req.flash("error", "未找到文章");
      return res.redirect(join(req.baseUrl));
    } else {
      return res.render("posts/post", { post });
    }
  });
});

posts.get("/update/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  Post.findById(id, (err: MongoError, post: IPost) => {
    if (err) {
      logger.error(`can't find (${id}) post`);
      req.flash("error", "未找到文章");
      return res.redirect(join(req.baseUrl));
    } else {
      return res.render("posts/edit", { post });
    }
  });
});

posts.post("/update/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, body } = req.fields;
  const validator = new Validator();

  { // 检查标题
    const [ok, message] = validator.title(<string>title).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "create"));
    }
  }

  { // 检查内容
    const [ok, message] = validator.body(<string>body).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "create"));
    }
  }

  const htmlBody = md.render(<string>body);
  Post.findOneAndUpdate({ _id: id }, { title, body, htmlBody }, (err: MongoError, post: IPost) => {
    if (err) {
      logger.error(`update post (${id}) failed`);
      req.flash("error", "更新文章失败");
      return res.redirect(join(req.baseUrl, "update", id));
    } else {
      return res.redirect(join(req.baseUrl, id));
    }
  });
});

posts.delete("/delete/:postId", (req: Request, res: Response) => {
  const { postId } = req.params;
  res.send(postId);
});

export default posts;
