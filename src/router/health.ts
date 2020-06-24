import { Request, Response, Router } from "express";

// url prefix: "/health"
export const health = Router();

health.get("/readiness", async (req: Request, res: Response) => {
  return res.status(200).send("ok");
});

health.get("/liveness", async (req: Request, res: Response) => {
  return res.status(200).send("ok");
});
