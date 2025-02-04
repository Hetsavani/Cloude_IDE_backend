// // server/services/terminalService.js
const { spawn } = require('child_process');

const createTerminalSession = (ws) => {
    // const shell = process.env.SHELL || '/bin/bash'; // Default shell (you can make this configurable)
    const shell = process.env.SHELL || (process.platform === 'win32' ? 'cmd.exe' : '/bin/bash');
    const childProcess = spawn(shell, [], {
        cwd: process.env.HOME, // Initial working directory (user's home directory or project dir)
        env: process.env, // Inherit server environment (consider security implications for env vars)
    });

    // Send data from child process (output) to WebSocket
    childProcess.stdout.on('data', (data) => {
        ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
    });

    // Handle error output from child process
    childProcess.stderr.on('data', (data) => {
        ws.send(JSON.stringify({ type: 'error', data: data.toString() }));
    });

    // Handle exit event
    childProcess.on('exit', (code, signal) => {
        ws.send(JSON.stringify({ type: 'exit', code, signal })); // Inform frontend of exit
        ws.close(); // Close WebSocket on terminal exit
    });

    // Handle input from WebSocket and send to child process
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'input') {
                childProcess.stdin.write(parsedMessage.data); // Send input from frontend to terminal
            }
        } catch (error) {
            console.error('WebSocket message parsing error:', error);
        }
    });

    // Handle WebSocket close and clean up child process
    ws.on('close', () => {
        console.log('WebSocket closed, destroying child process');
        childProcess.kill(); // Clean up child process when WebSocket closes
    });

    return childProcess; // You might return the child process if you need to manage it further
};

module.exports = { createTerminalSession };
