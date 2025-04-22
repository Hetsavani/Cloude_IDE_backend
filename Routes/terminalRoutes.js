<<<<<<< HEAD
// server/routes/terminalRoutes.js
const express = require('express');
const router = express.Router();

// In this simplified setup, we are primarily using WebSockets for the terminal.
// Therefore, we might not need traditional REST API routes in this file *yet*.

// However, we are creating this `terminalRoutes.js` file and mounting it in `server.js`
// to keep the routing structure organized and in case we want to add REST API
// endpoints related to terminal management in the future.

// For example, in the future, you might want to add routes like:
//
// GET /api/terminal/status/:terminalId - To get the status of a specific terminal session
// POST /api/terminal/command/:terminalId - To send a command to a specific terminal session via API (less real-time than WebSocket)
// etc.

// For now, this router is intentionally empty of specific routes,
// as the main terminal communication is over WebSockets handled in `server.js` and `terminalService.js`.

=======
// server/routes/terminalRoutes.js
const express = require('express');
const router = express.Router();

// In this simplified setup, we are primarily using WebSockets for the terminal.
// Therefore, we might not need traditional REST API routes in this file *yet*.

// However, we are creating this `terminalRoutes.js` file and mounting it in `server.js`
// to keep the routing structure organized and in case we want to add REST API
// endpoints related to terminal management in the future.

// For example, in the future, you might want to add routes like:
//
// GET /api/terminal/status/:terminalId - To get the status of a specific terminal session
// POST /api/terminal/command/:terminalId - To send a command to a specific terminal session via API (less real-time than WebSocket)
// etc.

// For now, this router is intentionally empty of specific routes,
// as the main terminal communication is over WebSockets handled in `server.js` and `terminalService.js`.

>>>>>>> Het
module.exports = router;