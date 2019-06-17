import { Request, Response } from "express";

function pageNotFound(req: Request, res: Response) {
  if (!res.headersSent) {
    res.status(404).render("404", {});
  }
}

export default pageNotFound;
