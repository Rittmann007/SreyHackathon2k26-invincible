const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const {
  businessOnly,
  studentOnly,
} = require('../middleware/roleguard.middleware');

const taskController = require('../Controllers/Task.controller');

// Create task
router.post(
  '/',
  authMiddleware,
  businessOnly,
  taskController.createTask
);

// Get all open tasks
router.get(
  '/',
  authMiddleware,
  taskController.getTasks
);

// Business gets own tasks
router.get(
  '/my',
  authMiddleware,
  businessOnly,
  taskController.getMyTasks
);

// Student gets applied tasks
router.get(
  '/applied',
  authMiddleware,
  studentOnly,
  taskController.getAppliedTasks
);

// Single task
router.get(
  '/:id',
  authMiddleware,
  taskController.getTaskById
);

// Update task
router.patch(
  '/:id',
  authMiddleware,
  businessOnly,
  taskController.updateTask
);

// Update task status
router.patch(
  '/:id/status',
  authMiddleware,
  businessOnly,
  taskController.updateTaskStatus
);

// Delete task
router.delete(
  '/:id',
  authMiddleware,
  businessOnly,
  taskController.deleteTask
);

module.exports = router;