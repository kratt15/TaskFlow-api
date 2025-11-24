import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const categoryController = new CategoryController();

router.post('/', authenticateToken, (req, res) =>
  categoryController.create(req, res)
);
router.get('/', authenticateToken, (req, res) =>
  categoryController.getAll(req, res)
);
router.get('/:id', authenticateToken, (req, res) =>
  categoryController.getById(req, res)
);
router.put('/:id', authenticateToken, (req, res) =>
  categoryController.update(req, res)
);
router.delete('/:id', authenticateToken, (req, res) =>
  categoryController.delete(req, res)
);

export default router;
