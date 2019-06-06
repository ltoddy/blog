import { Request, Response, Router } from "express";

// url prefix: "/comments"
const comments = Router();

comments.post("/", (req: Request, res: Response) => {
  res.send("创建一条留言");
});

comments.delete("/:commentId", (req: Request, res: Response) => {
  const { commentId } = req.params;
  res.send("删除一条留言" + commentId);
});

export default comments;
