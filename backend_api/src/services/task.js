//
/**
 * PUBLIC_INTERFACE
 * TaskService manages an persistent list of tasks with CRUD operations.
 * Tasks schema: { id: string, description: string, completed: boolean }
 * Data is persisted on disk using a JSON file to simulate browser localStorage.
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../../data/tasks.json');

class TaskService {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
    this._load();
  }

  // Load tasks from disk if available
  _load() {
    try {
      if (fs.existsSync(DATA_PATH)) {
        const raw = fs.readFileSync(DATA_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        this.tasks = parsed.tasks || [];
        this.nextId = parsed.nextId || 1;
      }
    } catch (err) {
      // On error, just use empty
      this.tasks = [];
      this.nextId = 1;
    }
  }

  // Save tasks to disk
  _save() {
    try {
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
      fs.writeFileSync(
        DATA_PATH,
        JSON.stringify({ tasks: this.tasks, nextId: this.nextId }, null, 2),
        'utf8'
      );
    } catch (err) {
      // Could not persist, log error for awareness but continue
      // Not fatal for business logic
      console.error('Failed to save tasks:', err);
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
    this._save();
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
    this._save();
    return { ...task };
  }

  // PUBLIC_INTERFACE
  deleteTask(id) {
    /** Deletes the task with the given id. Returns true if deleted, false if not found. */
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    this._save();
    return true;
  }
}

module.exports = new TaskService();
