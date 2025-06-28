//
// TaskController - REST API controller for tasks
//
const taskService = require('../services/task');

class TaskController {
  // PUBLIC_INTERFACE
  getTasks(req, res) {
    /**
     * Handles GET /tasks. Supports optional 'completed' query filter.
     */
    try {
      const filter = {};
      if (typeof req.query.completed !== 'undefined') {
        filter.completed = req.query.completed;
      }
      const tasks = taskService.getTasks(filter);
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to fetch tasks.' });
    }
  }

  // PUBLIC_INTERFACE
  addTask(req, res) {
    /**
     * Handles POST /tasks. Takes { description } in JSON body.
     */
    const { description } = req.body;
    try {
      if (!description) {
        return res.status(400).json({ error: 'Task description is required.' });
      }
      const task = taskService.addTask(description);
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message || 'Failed to add task.' });
    }
  }

  // PUBLIC_INTERFACE
  updateTask(req, res) {
    /**
     * Handles PUT /tasks/:id. Takes { description?, completed? } in JSON body.
     */
    const { id } = req.params;
    const updates = {};
    if (typeof req.body.completed !== 'undefined') {
      updates.completed = Boolean(req.body.completed);
    }
    if (typeof req.body.description !== 'undefined') {
      updates.description = req.body.description;
    }
    try {
      const updated = taskService.updateTask(id, updates);
      res.json(updated);
    } catch (err) {
      res.status(404).json({ error: err.message || 'Task not found.' });
    }
  }

  // PUBLIC_INTERFACE
  deleteTask(req, res) {
    /**
     * Handles DELETE /tasks/:id.
     */
    const { id } = req.params;
    const deleted = taskService.deleteTask(id);
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Task not found.' });
    }
  }
}

module.exports = new TaskController();
