const swaggerJSDoc = require('swagger-jsdoc');

/**
 * OpenAPI/Swagger Specification for Task Management API
 * Documents all REST endpoints for /tasks.
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do Task Management API',
      version: '1.0.0',
      description: 'API for managing tasks (add, list/filter, update, delete).',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
    ],
    tags: [
      {
        name: 'Tasks',
        description: 'APIs for managing to-do tasks'
      }
    ],
    components: {
      schemas: {
        // Task object schema
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Task unique identifier'
            },
            description: {
              type: 'string',
              description: 'Description of the task'
            },
            completed: {
              type: 'boolean',
              description: 'Whether the task is completed'
            }
          },
          required: ['id', 'description', 'completed']
        },
        // POST/PUT input
        TaskInput: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Description of the task'
            },
            completed: {
              type: 'boolean',
              description: 'Completion status of the task (optional for update)'
            }
          },
          required: ['description']
        },
        // PATCH input (optional)
        TaskUpdate: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'New description (optional)'
            },
            completed: {
              type: 'boolean',
              description: 'Completion status (optional)'
            }
          }
        },
        // Standard error response
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error description'
            }
          }
        }
      }
    },
    paths: {
      // GET /tasks (list, filter)
      '/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get list of tasks (optionally filter by completed status)',
          description: 'Returns a list of tasks. Optional ?completed=true|false query to filter by status.',
          parameters: [
            {
              in: 'query',
              name: 'completed',
              schema: {
                type: 'string',
                enum: ['true', 'false']
              },
              required: false,
              description: 'Filter tasks by completion status'
            }
          ],
          responses: {
            200: {
              description: 'Array of tasks',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Task' }
                  }
                }
              }
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        },
        // POST /tasks (add)
        post: {
          tags: ['Tasks'],
          summary: 'Add a new task',
          description: 'Add a new task. Requires \'description\' field in the request body.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TaskInput'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Created task',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Task' }
                }
              }
            },
            400: {
              description: 'Invalid input or missing description',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },

      // /tasks/{id} for PUT and DELETE
      '/tasks/{id}': {
        put: {
          tags: ['Tasks'],
          summary: 'Update a task',
          description: 'Update the description and/or completion status of a task by id.',
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: { type: 'string' },
              required: true,
              description: 'Task id'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskUpdate' }
              }
            }
          },
          responses: {
            200: {
              description: 'Updated task',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Task' }
                }
              }
            },
            404: {
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete a task',
          description: 'Delete a task by id.',
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: { type: 'string' },
              required: true,
              description: 'Task id'
            }
          ],
          responses: {
            200: {
              description: 'Deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' }
                    }
                  }
                }
              }
            },
            404: {
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [] // Not using JSDoc scan; schema is defined inline for clarity
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
