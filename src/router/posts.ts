import { join } from "path";

import { Request, Response, Router } from "express";
import { MongoError } from "mongodb";
import MarkdownIt from "markdown-it";

import loggerFactory from "../utils/logger";
import Validator from "../utils/validate";
import { signinRequire } from "../middlewares/authenticate";
import Post, { IPost } from "../models/Post";
import Comment, { IComment } from "../models/Comment";

// 目前转成markdown都是在controller层做的,以后改成在model层通过mongo的中间件做
const md = new MarkdownIt();
const logger = loggerFactory("posts.ts");
// url prefix: "/posts"
const posts = Router();

posts.get("/", (req: Request, res: Response) => {
  Post.find((err: MongoError, posts: IPost[]) => {
    return res.render("posts/index", { posts, post: undefined });
  });
});

posts.get("/create", signinRequire, (req: Request, res: Response) => {
  // { post: undefined } 是为了兼容 navigator.ejs，不然报错
  return res.render("posts/create", { post: undefined });
});

posts.post("/create", signinRequire, (req: Request, res: Response) => {
  const { title, body, wall } = req.fields;
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
  Post.create({ title, body, htmlBody, wall }, (err: MongoError, post: IPost) => {
    if (err) {
      logger.error(`create post(${title}) failed. ${err.message}`);
      if (err.message.match("dup key")) {
        req.flash("error", "文章重复");
      } else {
        req.flash("error", "创建文章失败，请重试");
      }
      return res.redirect(join(req.baseUrl, "create"));
    } else {
      req.flash("info", "发布新文章成功");
      return res.redirect(join(req.baseUrl));
    }
  });
});

posts.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  // Post.findOneAndUpdate()  use this api
  Post.findById(id, (err: MongoError, post: IPost) => {
    if (err) {
      logger.error(`can't find (${id}) post`);
      req.flash("error", "未找到文章");
      return res.redirect(join(req.baseUrl));
    } else {
      Comment.find({ postId: id }, (err: MongoError, comments: IComment[]) => {
        return res.render("posts/post", { post, comments });
      });
    }
  });
});

posts.get("/edit/:id", (req: Request, res: Response) => {
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

posts.post("/edit/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, timestamp, wall, body } = req.fields;
  const validator = new Validator();

  { // 检查标题
    const [ok, message] = validator.title(<string>title).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "edit", id));
    }
  }

  { // 检查内容
    const [ok, message] = validator.body(<string>body).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "edit", id));
    }
  }

  { // 检查壁纸url
    const [ok, message] = validator.absoluteUrl(<string>wall).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(join(req.baseUrl, "edit", id));
    }
  }

  const htmlBody = md.render(<string>body);
  Post.findOneAndUpdate({ _id: id }, { title, timestamp, wall, body, htmlBody }, (err: MongoError, post: IPost) => {
    if (err) {
      logger.error(`update post (${id}) failed`);
      req.flash("error", "更新文章失败");
      return res.redirect(join(req.baseUrl, "update", id));
    } else {
      return res.redirect(join(req.baseUrl, id));
    }
  });
});

posts.get("/delete/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Post.findById(id, (err: MongoError, post: IPost) => {
    if (err) {
      logger.error(`can't find (${id}) post`);
      req.flash("error", "未找到文章");
      return res.redirect(join(req.baseUrl, "delete", id));
    } else {
      return res.render("posts/delete", { post });
    }
  });
});

posts.post("/delete/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Post.deleteOne({ _id: id }, (err: MongoError) => {
    if (err) {
      logger.error(`delete (${id}) failed`);
      req.flash("error", "删除失败");
      return res.redirect(join(req.baseUrl, "delete", id));
    } else {
      req.flash("info", "删除成功");
      return res.redirect(req.baseUrl);
    }
  });
});

export default posts;
