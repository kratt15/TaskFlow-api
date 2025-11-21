import { Router } from "express";
import authRoutes from "./auth.js";
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

// Routes d'authentification
router.use("/auth", authRoutes);

export default router;
