import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskAnalytics,
  getAIAssist,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask);
router.get('/project/:projectId', protect, getTasks);
router.get('/stats/analytics/:projectId', protect, getTaskAnalytics);
router.post('/:id/ai-assist', protect, getAIAssist);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
