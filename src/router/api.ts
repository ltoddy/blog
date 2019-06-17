import { Request, Response, Router } from "express";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

// url prefix: "/api"
const api = Router();

api.post("/renderToMarkdown", (req: Request, res: Response) => {
  const { body } = req.body;
  return res.send(md.render(body));
});

api.get("/dump", (req: Request, res: Response) => {
  // TODO
});

api.post("/load", (req: Request, res: Response) => {
  // TODO
});

export default api;
