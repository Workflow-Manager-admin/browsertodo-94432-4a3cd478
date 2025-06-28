_e# browsertodo-94432-4a3cd478

## Backend API Persistence

This project simulates browser `localStorage` for persisting tasks by using a simple file storage on the backend. The `TaskService` uses a `tasks.json` file, stored in the backend project root, to persist all to-do tasks. All changes (add, update, delete) to the task list will be saved to this file automatically.

**Note:** The backend is now ready for integration with any frontend that expects REST endpoints for task management (`GET`, `POST`, `PUT`, `DELETE` at `/tasks` endpoints).
