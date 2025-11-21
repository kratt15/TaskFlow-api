import { Router } from "express";
// import { type Request, type Response } from "express";

const router = Router();

// Routes de santé
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime()} seconds`,
  });
});

export default router;
