// const WebSocket = require('ws');

// const ws = new WebSocket('ws://localhost:5000/api/execute-code');

// ws.on('open', () => {
//     console.log('WebSocket connection established');
//     ws.send(JSON.stringify({ language: 'javascript', code: 'console.log("Hello, World!");' }));
// });

// ws.on('message', (message) => {
//     console.log('Message from server:', message);
// });

// ws.on('close', () => {
//     console.log('WebSocket connection closed');
// });

// ws.on('error', (error) => {
//     console.error('WebSocket error:', error);
// });

const axios = require('axios');

const testCodeExecution = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/execute/run', {
      code: 'console.log("Hello, World!")',
      language: 'javascript',
    });
    console.log('Output:', response.data.output);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

testCodeExecution();