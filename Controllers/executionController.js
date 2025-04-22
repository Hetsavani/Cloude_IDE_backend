<<<<<<< HEAD
// // server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// Judge0 API Configuration
// const JUDGE0_API = process.env.JUDGE0_API || 'https://judge0-ce.p.rapidapi.com';
// const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY; // Your RapidAPI key

// Language ID mapping
// const LANGUAGE_IDS = {
//   'cpp': 54,    // C++
//   'java': 62,   // Java
//   'python': 71, // Python
//   'javascript': 63, // Node.js
// };
// const execCode = async (req,res)=>{
//   try {
//     const { language, code, input } = req.body;
//     // Submit submission to Judge0
//     const submission = await axios.post(`https://judge0-ce.p.rapidapi.com/submissions`, {
//       source_code: code,
//       language_id: LANGUAGE_IDS[language],
//       stdin: input
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'x-rapidapi-key': 'c81ff236aemshf1a3f54b06af22cp170afdjsnaf19762b27a0',
//         'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//       }
//     });

//     const token = submission.data.token;

//     // Poll for results
//     let result;
//     let attempts = 0;
//     const maxAttempts = 10;

//     while (attempts < maxAttempts) {
//       const response = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
//         headers: {
//           'x-rapidapi-key': 'c81ff236aemshf1a3f54b06af22cp170afdjsnaf19762b27a0',
//           'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//         }
//       });

//       if (response.data.status.id > 2) { // Status > 2 means processing is complete
//         result = response.data;
//         console.log("============================================================================================");
//         console.log(result);
//         console.log(input)
//         break;
//       }

//       attempts++;
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before polling again
//     }

//     if (!result) {
//       throw new Error('Compilation/Execution timed out');
//     }

//     res.json({
//       status: result.status,
//       stdout: result.stdout,
//       stderr: result.stderr,
//       compile_output: result.compile_output,
//       time: result.time,
//       memory: result.memory
//     });

//   } catch (error) {
//     console.error('Execution error:', error);
//     res.status(500).json({ error: error.message });
//   }
// }

// module.exports = {execCode}
// export default execCode;
// Submit code for execution
// app.post('/api/execute', async (req, res) => {

// });

//================================================================

// const codeService = require('../Services/codeExecutionService');

// const executeCode = async (req, res) => {
//   const { code, language } = req.body;

//   try {
//     const output = await codeService.executeCode(code, language);
//     res.json({ output });
//   } catch (error) {
//     console.error('Error executing code:', error);
//     res.status(500).json({ output: error.message });
//   }
// };

// module.exports = { executeCode };

// ======================================================================
// const WebSocket = require('ws');
// const codeExecutionService = require('../Services/codeExecutionService');

// let wss;

// const setupWebSocketServer = (server) => {
//     if (wss) return; // Prevent multiple WebSocket server instances

//     wss = new WebSocket.Server({ noServer: true });

//     wss.on('connection', (ws, request) => {
//         console.log('WebSocket connection established');

//         ws.on('message', (message) => {
//             console.log('Received message:', message);
//         });

//         ws.on('close', () => {
//             console.log('WebSocket connection closed');
//         });

//         ws.on('error', (error) => {
//             console.error('WebSocket error:', error);
//         });
//     });

//     server.on('upgrade', (request, socket, head) => {
//         console.log('Handling WebSocket upgrade...');
//         wss.handleUpgrade(request, socket, head, (ws) => {
//             console.log('WebSocket connection upgraded');
//             wss.emit('connection', ws, request);
//         });
//     });

//     console.log('WebSocket server setup complete');
// };
// const initiateWebSocket = (req, res) => {
//     console.log('Initiating WebSocket...');

//     const { language, code } = req.body;
//     if (!language || !code) {
//         return res.status(400).json({ error: 'Language and code are required.' });
//     }

//     if (!req.app.server) {
//         return res.status(500).json({ error: 'Server instance is not available.' });
//     }

//     // Ensure WebSocket Server is set up
//     setupWebSocketServer(req.app.server);

//     res.status(200).json({ message: 'WebSocket connection initiated.' });
// };

// module.exports = { initiateWebSocket };
// const initiateWebSocket = (req, res) => {
//     console.log('Initiating WebSocket...');

//     const { language, code } = req.body;
//     if (!language || !code) {
//         console.log('Missing language or code');
//         return res.status(400).json({ error: 'Language and code are required.' });
//     }

//     const server = req.app.server;
//     if (!server) {
//         console.log('Server instance is not available');
//         return res.status(500).json({ error: 'Server instance is not available.' });
//     }

//     // Create a new WebSocket server
//     const wss = new WebSocket.Server({ noServer: true });

//     // Handle WebSocket connection
//     wss.on('connection', (ws) => {
//         console.log('WebSocket connection established');
//         codeExecutionService.executeCodeWithUserInput(ws, language, code);

//         // Handle WebSocket close event
//         ws.on('close', () => {
//             console.log('WebSocket connection closed');
//         });

//         // Handle WebSocket error event
//         ws.on('error', (error) => {
//             console.error('WebSocket error:', error);
//         });
//     });

//     // Ensure req.app.server is defined
//     if (!req.app.server) {
//         console.log('Server instance is not available');
//         return res.status(500).json({ error: 'Server instance is not available.' });
//     }

//     // Upgrade HTTP connection to WebSocket
//     console.log('Handling upgrade... 123');
//     server.on('upgrade', (request, socket, head) => {
//         console.log('Handling upgrade...');
//         wss.handleUpgrade(request, socket, head, (ws) => {
//             console.log('WebSocket connection upgraded');
//             wss.emit('connection', ws, request);
//         });
//     });

//     res.status(200).json({ message: 'WebSocket connection initiated.' });
// };

// // // server/controllers/executionController.js
// // const { exec } = require('child_process'); // For executing commands

// // const executeCode = async (req, res) => {
// //     const { language, code } = req.body;

// //     if (!language || !code) {
// //         return res.status(400).json({ error: 'Language and code are required.' });
// //     }

// //     let command = '';
// //     switch (language) {
// //         case 'javascript':
// //             command = `node -e "${code}"`; // Execute JavaScript using Node.js
// //             break;
// //         case 'python':
// //             command = `python -c "${code}"`; // Execute Python
// //             break;
// //         // Add cases for other languages you want to support (e.g., 'java', 'c++', etc.)
// //         default:
// //             return res.status(400).json({ error: 'Unsupported language.' });
// //     }

// //     exec(command, (error, stdout, stderr) => {
// //         if (error) {
// //             console.error(`Execution error: ${error}`);
// //             return res.status(500).json({ error: 'Execution failed', details: stderr || error.message });
// //         }
// //         res.json({ output: stdout, error: stderr }); // Send back stdout and stderr
// //     });
// // };

// // module.exports = { executeCode };

// server/controllers/executionController.js
const codeExecutionService = require("../Services/codeExecutionService"); // Import the service

const executeCode = async (req, res) => {
  const { language, code, input, filename } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required." });
  }

  try {
    // **Now correctly calling the executeCode function from codeExecutionService.js**
    const executionResult = await codeExecutionService.execCode(
      language,
      code,
      input,
      filename
    );

    res.json(executionResult); // Send back the result from the service
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: "Failed to execute code.", details: error });
  }
};

module.exports = { executeCode };
=======
// // server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// Judge0 API Configuration
// const JUDGE0_API = process.env.JUDGE0_API || 'https://judge0-ce.p.rapidapi.com';
// const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY; // Your RapidAPI key

// Language ID mapping
// const LANGUAGE_IDS = {
//   'cpp': 54,    // C++
//   'java': 62,   // Java
//   'python': 71, // Python
//   'javascript': 63, // Node.js
// };
// const execCode = async (req,res)=>{
//   try {
//     const { language, code, input } = req.body;
//     // Submit submission to Judge0
//     const submission = await axios.post(`https://judge0-ce.p.rapidapi.com/submissions`, {
//       source_code: code,
//       language_id: LANGUAGE_IDS[language],
//       stdin: input
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'x-rapidapi-key': 'c81ff236aemshf1a3f54b06af22cp170afdjsnaf19762b27a0',
//         'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//       }
//     });

//     const token = submission.data.token;

//     // Poll for results
//     let result;
//     let attempts = 0;
//     const maxAttempts = 10;

//     while (attempts < maxAttempts) {
//       const response = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
//         headers: {
//           'x-rapidapi-key': 'c81ff236aemshf1a3f54b06af22cp170afdjsnaf19762b27a0',
//           'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//         }
//       });

//       if (response.data.status.id > 2) { // Status > 2 means processing is complete
//         result = response.data;
//         console.log("============================================================================================");
//         console.log(result);
//         console.log(input)
//         break;
//       }

//       attempts++;
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before polling again
//     }

//     if (!result) {
//       throw new Error('Compilation/Execution timed out');
//     }

//     res.json({
//       status: result.status,
//       stdout: result.stdout,
//       stderr: result.stderr,
//       compile_output: result.compile_output,
//       time: result.time,
//       memory: result.memory
//     });

//   } catch (error) {
//     console.error('Execution error:', error);
//     res.status(500).json({ error: error.message });
//   }
// }

// module.exports = {execCode}
// export default execCode;
// Submit code for execution
// app.post('/api/execute', async (req, res) => {

// });

//================================================================

// const codeService = require('../Services/codeExecutionService');

// const executeCode = async (req, res) => {
//   const { code, language } = req.body;

//   try {
//     const output = await codeService.executeCode(code, language);
//     res.json({ output });
//   } catch (error) {
//     console.error('Error executing code:', error);
//     res.status(500).json({ output: error.message });
//   }
// };

// module.exports = { executeCode };

// ======================================================================
// const WebSocket = require('ws');
// const codeExecutionService = require('../Services/codeExecutionService');

// let wss;

// const setupWebSocketServer = (server) => {
//     if (wss) return; // Prevent multiple WebSocket server instances

//     wss = new WebSocket.Server({ noServer: true });

//     wss.on('connection', (ws, request) => {
//         console.log('WebSocket connection established');

//         ws.on('message', (message) => {
//             console.log('Received message:', message);
//         });

//         ws.on('close', () => {
//             console.log('WebSocket connection closed');
//         });

//         ws.on('error', (error) => {
//             console.error('WebSocket error:', error);
//         });
//     });

//     server.on('upgrade', (request, socket, head) => {
//         console.log('Handling WebSocket upgrade...');
//         wss.handleUpgrade(request, socket, head, (ws) => {
//             console.log('WebSocket connection upgraded');
//             wss.emit('connection', ws, request);
//         });
//     });

//     console.log('WebSocket server setup complete');
// };
// const initiateWebSocket = (req, res) => {
//     console.log('Initiating WebSocket...');

//     const { language, code } = req.body;
//     if (!language || !code) {
//         return res.status(400).json({ error: 'Language and code are required.' });
//     }

//     if (!req.app.server) {
//         return res.status(500).json({ error: 'Server instance is not available.' });
//     }

//     // Ensure WebSocket Server is set up
//     setupWebSocketServer(req.app.server);

//     res.status(200).json({ message: 'WebSocket connection initiated.' });
// };

// module.exports = { initiateWebSocket };
// const initiateWebSocket = (req, res) => {
//     console.log('Initiating WebSocket...');

//     const { language, code } = req.body;
//     if (!language || !code) {
//         console.log('Missing language or code');
//         return res.status(400).json({ error: 'Language and code are required.' });
//     }

//     const server = req.app.server;
//     if (!server) {
//         console.log('Server instance is not available');
//         return res.status(500).json({ error: 'Server instance is not available.' });
//     }

//     // Create a new WebSocket server
//     const wss = new WebSocket.Server({ noServer: true });

//     // Handle WebSocket connection
//     wss.on('connection', (ws) => {
//         console.log('WebSocket connection established');
//         codeExecutionService.executeCodeWithUserInput(ws, language, code);

//         // Handle WebSocket close event
//         ws.on('close', () => {
//             console.log('WebSocket connection closed');
//         });

//         // Handle WebSocket error event
//         ws.on('error', (error) => {
//             console.error('WebSocket error:', error);
//         });
//     });

//     // Ensure req.app.server is defined
//     if (!req.app.server) {
//         console.log('Server instance is not available');
//         return res.status(500).json({ error: 'Server instance is not available.' });
//     }

//     // Upgrade HTTP connection to WebSocket
//     console.log('Handling upgrade... 123');
//     server.on('upgrade', (request, socket, head) => {
//         console.log('Handling upgrade...');
//         wss.handleUpgrade(request, socket, head, (ws) => {
//             console.log('WebSocket connection upgraded');
//             wss.emit('connection', ws, request);
//         });
//     });

//     res.status(200).json({ message: 'WebSocket connection initiated.' });
// };

// // // server/controllers/executionController.js
// // const { exec } = require('child_process'); // For executing commands

// // const executeCode = async (req, res) => {
// //     const { language, code } = req.body;

// //     if (!language || !code) {
// //         return res.status(400).json({ error: 'Language and code are required.' });
// //     }

// //     let command = '';
// //     switch (language) {
// //         case 'javascript':
// //             command = `node -e "${code}"`; // Execute JavaScript using Node.js
// //             break;
// //         case 'python':
// //             command = `python -c "${code}"`; // Execute Python
// //             break;
// //         // Add cases for other languages you want to support (e.g., 'java', 'c++', etc.)
// //         default:
// //             return res.status(400).json({ error: 'Unsupported language.' });
// //     }

// //     exec(command, (error, stdout, stderr) => {
// //         if (error) {
// //             console.error(`Execution error: ${error}`);
// //             return res.status(500).json({ error: 'Execution failed', details: stderr || error.message });
// //         }
// //         res.json({ output: stdout, error: stderr }); // Send back stdout and stderr
// //     });
// // };

// // module.exports = { executeCode };

// server/controllers/executionController.js
const codeExecutionService = require("../Services/codeExecutionService"); // Import the service

const executeCode = async (req, res) => {
  const { language, code, input, filename } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required." });
  }

  try {
    // **Now correctly calling the executeCode function from codeExecutionService.js**
    const executionResult = await codeExecutionService.execCode(
      language,
      code,
      input,
      filename
    );

    res.json(executionResult); // Send back the result from the service
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: "Failed to execute code.", details: error });
  }
};

module.exports = { executeCode };
>>>>>>> Het
