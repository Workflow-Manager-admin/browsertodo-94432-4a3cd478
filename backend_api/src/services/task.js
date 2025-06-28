//
/**
 * TaskService: File-based persistence (simulating localStorage) + in-memory cache.
 * On every modification, writes all tasks to disk (tasks.json).
 * On startup, loads tasks from disk if available; otherwise, starts with empty array.
 */

const fs = require('fs');
const path = require('path');

class TaskService {
  constructor() {
    this.filePath = path.join(__dirname, '../../tasks.json');
    this.tasks = [];
    this.nextId = 1;
    this._load();
  }

  // Load tasks from disk on init.
  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          this.tasks = arr;
          // Compute nextId as max id + 1
          const maxId = arr.reduce((max, t) => Math.max(max, parseInt(t.id, 10) || 0), 0);
          this.nextId = maxId + 1;
        }
      }
    } catch (e) {
      this.tasks = [];
      this.nextId = 1;
    }
  }

  // Write in-memory tasks to disk after every change
  _persist() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.tasks, null, 2), 'utf8');
    } catch (e) {
      // On error, log it; for test/demo UX silently drop to in-memory-only
      console.error('Failed to save tasks.json:', e);
    }
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
    this._persist();
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
    this._persist();
    return { ...task };
  }

  // PUBLIC_INTERFACE
  deleteTask(id) {
    /** Deletes the task with the given id. Returns true if deleted, false if not found. */
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    this._persist();
    return true;
  }
}

module.exports = new TaskService();
