import { Request, Response, Router } from "express";

// url prefix: "/"
const home = Router();

home.get("/", (req: Request, res: Response) => {
  res.render("home");
});

export default home;
