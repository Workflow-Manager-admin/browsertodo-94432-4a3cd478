const express = require('express');
const taskController = require('../controllers/task');

const router = express.Router();

/**
 * GET /tasks
 * Query params: ?completed=true|false (optional)
 * Returns all tasks, or filtered by completion status.
 */
router.get('/', taskController.getTasks.bind(taskController));

/**
 * POST /tasks
 * Body: { description }
 * Adds a new task.
 */
router.post('/', taskController.addTask.bind(taskController));

/**
 * PUT /tasks/:id
 * Body: { description?, completed? }
 * Updates an existing task.
 */
router.put('/:id', taskController.updateTask.bind(taskController));

/**
 * DELETE /tasks/:id
 * Deletes the specified task.
 */
router.delete('/:id', taskController.deleteTask.bind(taskController));

module.exports = router;
