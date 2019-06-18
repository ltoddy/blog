import { Request, Response, Router } from "express";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

// url prefix: "/api"
const api = Router();


api.post("/renderToMarkdown", (req: Request, res: Response) => {
  const { body } = req.body;
  return res.send(md.render(body));
});


// 计划是这样的，为了方便blog的迁移，此api，在浏览器打开后，会自动下载一个压缩包，压缩包中包含着所有的posts。
api.get("/dump", (req: Request, res: Response) => {
  // TODO
});

// 把压缩包上传到这里，然后自动的解压，把数据存到数据库中。
api.post("/load", (req: Request, res: Response) => {
  // TODO
});

export default api;
