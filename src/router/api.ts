import { Request, Response, Router } from "express";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

// url prefix: "/api"
export const api = Router();


api.post("/renderToMarkdown", (req: Request, res: Response) => {
  const { body } = req.body;
  return res.send(md.render(body));
});
