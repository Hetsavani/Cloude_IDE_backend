<<<<<<< HEAD
// server/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const fileRoutes = require("./Routes/fileRoutes");
const executionRoutes = require("./Routes/executionRoutes");
const terminalRoutes = require("./Routes/terminalRoutes"); // Import terminal routes
const http = require("http");

const app = express();
exports.app = app;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
require("./config/db")();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/execute", executionRoutes);
app.use("/api/terminal", terminalRoutes); // Use terminal routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});



const server = http.createServer(app);

// Store the server instance in the app object
// app.server = server;

// Start the server
// const PORT = process.env.PORT || 3000;

// const server = app.listen(PORT, () => { // Get the HTTP server instance
//     console.log(`Server is running on port ${PORT}`);
// });

// WebSocket Server Setup for Terminal
// const WebSocket = require('ws');
// const terminalService = require('./Services/terminalService');
const { Server: Socketserver } = require("socket.io");
var newDir = "D:\\Projects\\Cloud IDE\\Users\\";

const io = new Socketserver(server, {
  cors: {
    origin: "*",
  },
});

// wss.on('connection', (ws, req) => {

//     console.log('WebSocket connection established for terminal');
//     terminalService.createTerminalSession(ws); // Create terminal session for each connection

//     ws.on('close', () => {
//         console.log('WebSocket connection closed for terminal');
//     });
// });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
=======
// server/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const fileRoutes = require("./Routes/fileRoutes");
const executionRoutes = require("./Routes/executionRoutes");
const terminalRoutes = require("./Routes/terminalRoutes"); // Import terminal routes
const http = require("http");

const app = express();
exports.app = app;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
require("./config/db")();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/execute", executionRoutes);
app.use("/api/terminal", terminalRoutes); // Use terminal routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});



const server = http.createServer(app);

// Store the server instance in the app object
// app.server = server;

// Start the server
// const PORT = process.env.PORT || 3000;

// const server = app.listen(PORT, () => { // Get the HTTP server instance
//     console.log(`Server is running on port ${PORT}`);
// });

// WebSocket Server Setup for Terminal
// const WebSocket = require('ws');
// const terminalService = require('./Services/terminalService');
const { Server: Socketserver } = require("socket.io");
var newDir = "D:\\Projects\\Cloud IDE\\Users\\";

const io = new Socketserver(server, {
  cors: {
    origin: "*",
  },
});

// wss.on('connection', (ws, req) => {

//     console.log('WebSocket connection established for terminal');
//     terminalService.createTerminalSession(ws); // Create terminal session for each connection

//     ws.on('close', () => {
//         console.log('WebSocket connection closed for terminal');
//     });
// });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
>>>>>>> Het
