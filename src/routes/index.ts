import { Router } from "express";
import { type Request, type Response } from "express";

const router = Router();

router.get("/", (request: Request, response: Response) => {
  response.json({ message: "Hello World" });
});

export default router;
