import { join } from "path";

import { Request, Response, Router } from "express";

import { loggerFactory } from "../utils/logger";
import Validator from "../utils/validate";
import { Comment } from "../models/Comment";

const logger = loggerFactory("comment.ts");
// url prefix: "/comments"
export const comments = Router();

comments.post("/", async (req: Request, res: Response) => {
  const { postId, author, email, body } = req.fields;
  const validator = new Validator();

  try {
    validator.email(<string>email).done(); // 检查邮箱
    validator.username(<string>author).done(); // 检查用户名
    validator.body(<string>body).done(); // 检查内容
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect(join(req.baseUrl, "signup"));
  }

  try {
    await Comment.new(<string>postId, <string>author, <string>email, <string>body);
    req.flash("info", "创建留言成功");
  } catch (error) {
    logger.info(`create comment failed: ${error}`);
    req.flash("error", "创建留言失败");
  }
  return res.redirect(`/posts/${postId}`);
});

// 待定
comments.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.send("删除一条留言" + id);
});
