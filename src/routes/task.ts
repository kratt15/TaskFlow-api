import { Router } from 'express';
import { TaskController } from '../controllers/TaskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const taskController = new TaskController();

router.get('/', authenticateToken, (req, res) =>
  taskController.getAll(req, res)
);
router.get('/:id', authenticateToken, (req, res) =>
  taskController.getById(req, res)
);
router.post('/', authenticateToken, (req, res) =>
  taskController.create(req, res)
);
router.put('/:id', authenticateToken, (req, res) =>
  taskController.update(req, res)
);
router.delete('/:id', authenticateToken, (req, res) =>
  taskController.delete(req, res)
);

export default router;
