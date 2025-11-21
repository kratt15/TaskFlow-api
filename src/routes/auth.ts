import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
const authController = new AuthController();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.get("/me", authenticateToken, (req, res) =>
  authController.getMe(req, res)
);

export default router;
