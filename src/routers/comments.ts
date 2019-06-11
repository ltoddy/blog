import { Request, Response, Router } from "express";
import { MongoError } from "mongodb";
import MarkdownIt from "markdown-it";

import { signinRequire } from "../middlewares/authenticate";
import loggerFactory from "../utils/logger";
import Comment, { IComment } from "../models/Comment";

const md = new MarkdownIt();
const logger = loggerFactory("comment.ts");
// url prefix: "/comments"
const comments = Router();

comments.post("/", signinRequire, (req: Request, res: Response) => {
  const author = req.session.user._id;
  const { body, postId } = req.fields;

  const htmlBody = md.render(<string>body);
  Comment.create({ author, body, postId, htmlBody }, (err: MongoError, comment: IComment) => {
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
