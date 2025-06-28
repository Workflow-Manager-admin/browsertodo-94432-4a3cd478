const express = require('express');
const healthController = require('../controllers/health');
const taskRoutes = require('./tasks');

const router = express.Router();

// Mount tasks endpoints
router.use('/tasks', taskRoutes);

// Health endpoint for "/"
router.get('/', healthController.check.bind(healthController));

module.exports = router;
