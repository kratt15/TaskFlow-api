import { Router } from "express";
// import { type Request, type Response } from "express";

const router = Router();


// Routes de santé
router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

export default router;
