import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getDashboardStats,
} from '../controllers/projectController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorizeRoles('Admin', 'Manager'), createProject)
  .get(protect, getProjects);

router.get('/stats/dashboard', protect, getDashboardStats);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, authorizeRoles('Admin', 'Manager'), updateProject)
  .delete(protect, authorizeRoles('Admin', 'Manager'), deleteProject);

export default router;
