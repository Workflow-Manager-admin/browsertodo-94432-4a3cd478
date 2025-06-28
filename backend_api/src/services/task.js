//
// TaskService - in-memory storage and business logic for tasks
//

/**
 * PUBLIC_INTERFACE
 * TaskService manages an in-memory list of tasks with CRUD operations.
 * Tasks schema: { id: string, description: string, completed: boolean }
 */
class TaskService {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  // PUBLIC_INTERFACE
  getTasks(filter = {}) {
    /** Returns a filtered list of tasks.
     * Supported filters: { completed: 'true'|'false' }
     */
    let tasks = this.tasks.slice();
    if (typeof filter.completed !== 'undefined') {
      const completed = filter.completed === 'true';
      tasks = tasks.filter(task => task.completed === completed);
    }
    return tasks;
  }

  // PUBLIC_INTERFACE
  addTask(description) {
    /** Adds a new task and returns it. */
    if (!description || typeof description !== 'string' || !description.trim()) {
      throw new Error('Description is required');
    }
    const task = {
      id: String(this.nextId++),
      description: description.trim(),
      completed: false
    };
    this.tasks.push(task);
    return task;
  }

  // PUBLIC_INTERFACE
  updateTask(id, updates) {
    /** Updates a task's description or completed status. */
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    const task = this.tasks[idx];
    if (typeof updates.description === 'string' && updates.description.trim()) {
      task.description = updates.description.trim();
    }
    if (typeof updates.completed === 'boolean') {
      task.completed = updates.completed;
    }
    return { ...task };
  }

  // PUBLIC_INTERFACE
  deleteTask(id) {
    /** Deletes the task with the given id. Returns true if deleted, false if not found. */
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    return true;
  }
}

module.exports = new TaskService();
