import { Request, Response, Router } from "express";
import { MongoError } from "mongodb";
import MarkdownIt from "markdown-it";

import loggerFactory from "../utils/logger";
import Comment, { IComment } from "../models/Comment";
import Validator from "../utils/validate";

const md = new MarkdownIt();
const logger = loggerFactory("comment.ts");
// url prefix: "/comments"
const comments = Router();

comments.post("/", (req: Request, res: Response) => {
  const { postId, author, email, body } = req.fields;
  const validator = new Validator();

  { // 检查邮箱
    const [ok, message]: [boolean, string] = validator.email(<string>email).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(req.baseUrl);
    }
  }

  { // 检查用户名
    const [ok, message]: [boolean, string] = validator.username(<string>author).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(req.baseUrl);
    }
  }

  { // 检查内容
    const [ok, message] = validator.body(<string>body).result();
    if (!ok) {
      req.flash("error", message);
      return res.redirect(req.baseUrl);
    }
  }

  const htmlBody = md.render(<string>body);
  Comment.create({ postId, author, email, body, htmlBody }, (err: MongoError, comment: IComment) => {
    if (err) {
      req.flash("error", "创建留言失败");
    } else {
      req.flash("info", "创建留言成功");
    }

    return res.redirect(`/posts/${postId}`);
  });
});

// 待定
comments.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.send("删除一条留言" + id);
});

export default comments;
