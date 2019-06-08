import { Request, Response, Router } from "express";

// url prefix: "/posts"
const posts = Router();

posts.get("/", (req: Request, res: Response) => {
  res.send("全部posts");
});

posts.post("/create", (req: Request, res: Response) => {
  res.send("创建");
});

posts.get("/:postId", (req: Request, res: Response) => {
  const { postId } = req.params;
  res.send(postId);
});

posts.put("/update/:postId", (req: Request, res: Response) => {
  const { postId } = req.params;
  res.send(postId);
});

posts.delete("/delete/:postId", (req: Request, res: Response) => {
  const { postId } = req.params;
  res.send(postId);
});

export default posts;
