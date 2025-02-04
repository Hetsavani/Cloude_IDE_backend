// // server/routes/executionRoutes.js
// import execCode from './../Controllers/executionController';
// const execCode = require('./../Controllers/executionController');
// const express = require('express');
// const router = express.Router();
// const executionController = require('../Controllers/executionController');
// const authMiddleware = require('../Middleware/authMiddleware');

// // POST /api/execute/run
// router.post('/run', authMiddleware, executionController.executeCode);

// module.exports = router;
const express = require('express');
const router = express.Router();
const executionController = require('../Controllers/executionController');
const authMiddleware = require('../Middleware/authMiddleware');
// const WebSocket = require('ws');
// const { execCode } = require('../Services/codeExecutionService');

// POST /api/execute/run
// router.post('/run', authMiddleware, executionController.initiateWebSocket);
router.post('/run', executionController.executeCode);
// router.post('/run', executionController.execCode);
// router.post('/run', execCode);
module.exports = router;