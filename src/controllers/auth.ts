import { Request, Response, Router } from "express";

// url prefix: "/auth"
const auth = Router();

auth.get("/signup", (req: Request, res: Response) => {

});

export default auth;
