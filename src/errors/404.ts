import { Request, Response } from "express";

function pageNotFound(req: Request, res: Response) {
  if (!res.headersSent) {
    res.status(404).render("404", { post: undefined });
  }
}

export default pageNotFound;
