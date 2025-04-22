// server/services/codeExecutionService.js
const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * Executes code in a specified language.
 *
 * @param {string} language - The programming language (e.g., 'javascript', 'python').
 * @param {string} code - The code to execute.
 * @param {string} [stdin=''] - Optional standard input to provide to the code.
 * @returns {Promise<{output: string, error: string, exitCode: number, executionError?: string, spawnError?: string}>}
 *          A promise that resolves with an object containing the output, error, exit code, and potential errors.
 *          Rejects with an error object if execution fails or language is unsupported.
 */
// const executeCode = async (language, code, stdin = '') => {
const executeCode = async (language, code, stdin = "") => {
  return new Promise((resolve, reject) => {
    let command;
    let args = [];
    let options = {};

    switch (language) {
      case "javascript":
        command = "node";
        args = ["-e", code]; // Execute JavaScript code directly
        break;
      case "python":
        command = "python";
        args = ["-c", code]; // Execute Python code directly
        break;
      // Add cases for other languages here (e.g., Java, C++, etc.)
      // For compiled languages, you'd likely need to handle compilation steps first.
      default:
        return reject({ error: "Unsupported language." });
    }

    const childProcess = spawn(command, args, options);

    let stdoutData = "";
    let stderrData = "";

    // Handle standard output
    childProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
      console.log(`stdout: ${data}`); // Optional: Log output to server console
    });

    // Handle standard error
    childProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
      console.error(`stderr: ${data}`); // Log errors to server console
    });

    // Handle process exit
    childProcess.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) {
        resolve({
          stdout: stdoutData.trimEnd(), // Trim trailing whitespace from output
          stderr: stderrData.trimEnd(), // Trim trailing whitespace from error
          exit_code: code,
          execution_time: "0", // Placeholder, can be implemented later
          memory: "0", // Placeholder, can be implemented later
          status: {
            id: 3, // Judge0 "Accepted" status ID
            description: "Accepted",
          },
        });
      } else {
        reject({
          stdout: stdoutData.trimEnd(),
          stderr: stderrData.trimEnd(),
          exit_code: code,
          execution_time: "0", // Placeholder
          memory: "0", // Placeholder
          status: {
            id: 4, // Judge0 "Runtime Error" status ID (adjust as needed for different exit codes)
            description: "Runtime Error", // Generic error description
          },
        });
      }
    });

    // Handle errors during spawn or execution
    childProcess.on("error", (err) => {
      console.error("Failed to spawn child process:", err);
      reject({
        output: stdoutData.trimEnd(),
        error: stderrData.trimEnd(),
        exitCode: -1, // Indicate spawn error
        spawnError: err.message,
      });
    });

    // Write to stdin if input is provided
    if (stdin) {
      childProcess.stdin.write(stdin);
      childProcess.stdin.end(); // Close stdin after writing input
    } else {
      childProcess.stdin.end(); // Close stdin even if no input is provided, to signal EOF
    }
  });
};

const execCode = (language, code, input, filename) => {
  return new Promise(async (resolve, reject) => {
    const tmpDir = os.tmpdir();
    let command;
    let args = [];
    let options = {};
    let fileName;
    console.log(code)
    try {
      switch (language.toLowerCase()) {
        case "javascript":
          command = "node";
          args = ["-e", code];
          break;

        case "python":
          command = "python";
          args = ["-c", code];
          break;

        case "java":
          // Create a temporary Java file
          fileName = filename;
          const javaFilePath = path.join(tmpDir, fileName);
          await fs.writeFile(javaFilePath, code);
          
          // Compile first
          await new Promise((resolveCompile, rejectCompile) => {
            exec(`javac ${javaFilePath}`, (error) => {
              if (error) rejectCompile(error);
              else resolveCompile();
            });
          });
          
          command = "java";
          args = ["-cp", tmpDir,(filename).split(".")[0]];
          break;

        case "cpp":
          fileName = filename;
          const cppFilePath = path.join(tmpDir, fileName);
          const cppOutputPath = path.join(tmpDir, filename.split(".")[0]+".exe");
          await fs.writeFile(cppFilePath, code);
          
          // Compile C++ code
          await new Promise((resolveCompile, rejectCompile) => {
            exec(`g++ ${cppFilePath} -o ${cppOutputPath}`, (error) => {
              if (error) rejectCompile(error);
              else resolveCompile();
            });
          });
          
          command = cppOutputPath;
          args = [];
          break;

        case "c":
          fileName = filename;
          const cFilePath = path.join(tmpDir, fileName);
          const cOutputPath = path.join(tmpDir, filename.split(".")[0]+".exe");
          await fs.writeFile(cFilePath, code);
          
          // Compile C code
          await new Promise((resolveCompile, rejectCompile) => {
            exec(`gcc ${cFilePath} -o ${cOutputPath}`, (error) => {
              if (error) rejectCompile(error);
              else resolveCompile();
            });
          });
          
          command = cOutputPath;
          args = [];
          break;

        default:
          return reject({ error: "Unsupported language." });
      }

      const childProcess = spawn(command, args, options);
      let stdoutData = "";
      let stderrData = "";
      let startTime = process.hrtime();

      // Handle standard output
      childProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
        console.log(`stdout: ${data}`);
      });

      // Handle standard error
      childProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
        console.error(`stderr: ${data}`);
      });

      // Handle process exit
      childProcess.on("close", async (code) => {
        const endTime = process.hrtime(startTime);
        const executionTime = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2); // Convert to milliseconds

        // Cleanup temporary files
        if (fileName) {
          try {
            await fs.unlink(path.join(tmpDir, fileName));
            if (language === "c" || language === "c++") {
              await fs.unlink(path.join(tmpDir, "program.exe"));
            } else if (language === "java") {
              await fs.unlink(path.join(tmpDir, "Main.class"));
            }
          } catch (err) {
            console.error('Cleanup error:', err);
          }
        }

        if (code === 0) {
          resolve({
            stdout: stdoutData.trimEnd(),
            stderr: stderrData.trimEnd(),
            exit_code: code,
            execution_time: executionTime,
            memory: "0", // Memory tracking could be added if needed
            status: {
              id: 3,
              description: "Accepted",
            },
          });
        } else {
          resolve({
            stdout: stderrData.trimEnd(),
            stderr: stderrData.trimEnd(),
            exit_code: code,
            execution_time: executionTime,
            memory: "0",
            status: {
              id: 4,
              description: "Runtime Error",
            },
          });
        }
      });

      // Handle errors during spawn or execution
      childProcess.on("error", (err) => {
        console.error("Failed to spawn child process:", err);
        resolve({
          stdout: err.trimEnd(),
          stderr: err.trimEnd(),
          exit_code: -1,
          execution_time: "0",
          memory: "0",
          status: {
            id: 5,
            description: "Server Error",
          },
          error: err.message,
        });
      });

      // Write to stdin if input is provided
      if (input) {
        childProcess.stdin.write(input);
        childProcess.stdin.end();
      } else {
        childProcess.stdin.end();
      }

    } catch (error) {
      console.error("Error during execution:", error);
      resolve({
        stdout: error.message.replace(/^Command failed: javac .*\n/, "").replace(/^.*Temp\.java:\d+: /, ""),
        stderr: error.message,
        exit_code: -1,
        execution_time: "0",
        memory: "0",
        status: {
          id: 5,
          description: "Server Error",
        },
        error: error.message,
      });
    }
  });
};

module.exports = { execCode };

// // server/services/codeExecutionService.js
// const { spawn } = require('child_process');

// const executeCode = async (language, code, stdin = '') => {
//     return new Promise((resolve, reject) => {
//         let command;
//         let args = [];
//         let options = {};

//         switch (language) {
//             case 'javascript':
//                 command = 'node';
//                 args = ['-e', code]; // Execute JavaScript code directly
//                 break;
//             case 'python':
//                 command = 'python';
//                 args = ['-c', code]; // Execute Python code directly
//                 break;
//             // Add cases for other languages here (e.g., Java, C++, etc.)
//             // For compiled languages, you'd likely need to handle compilation steps first.
//             default:
//                 return reject({ error: 'Unsupported language.' });
//         }

//         const childProcess = spawn(command, args, options);

//         let stdoutData = '';
//         let stderrData = '';

//         // Handle standard output
//         childProcess.stdout.on('data', (data) => {
//             stdoutData += data.toString();
//             console.log(`stdout: ${data}`); // Optional: Log output to server console
//         });

//         // Handle standard error
//         childProcess.stderr.on('data', (data) => {
//             stderrData += data.toString();
//             console.error(`stderr: ${data}`); // Log errors to server console
//         });

//         // Handle process exit
//         childProcess.on('close', (code) => {
//             console.log(`child process exited with code ${code}`);
//             if (code === 0) {
//                 resolve({
//                     output: stdoutData,
//                     error: stderrData, // Still include stderr in case of warnings
//                     exitCode: code,
//                 });
//             } else {
//                 reject({
//                     output: stdoutData,
//                     error: stderrData,
//                     exitCode: code,
//                     executionError: `Process exited with code ${code}`
//                 });
//             }
//         });

//         // Handle errors during spawn or execution
//         childProcess.on('error', (err) => {
//             console.error('Failed to spawn child process:', err);
//             reject({
//                 output: stdoutData,
//                 error: stderrData,
//                 exitCode: -1, // Indicate spawn error
//                 spawnError: err.message,
//             });
//         });

//         // Write to stdin if input is provided
//         if (stdin) {
//             childProcess.stdin.write(stdin);
//             childProcess.stdin.end(); // Close stdin after writing input
//         } else {
//             childProcess.stdin.end(); // Close stdin even if no input is provided, to signal EOF
//         }
//     });
// };

// module.exports = { executeCode };
// const { spawn } = require('child_process');

// /**
//  * Executes code for a given language and interacts with user via WebSocket.
//  * @param {WebSocket} ws - WebSocket connection to communicate with the user.
//  * @param {string} language - Programming language to execute.
//  * @param {string} code - Code to execute.
//  */
// const executeCodeWithUserInput = (ws, language, code) => {
//     let command;
//     let args = [];
//     let options = {};

//     // Determine the command and arguments based on the language
//     switch (language) {
//         case 'javascript':
//             command = 'node';
//             args = ['-e', code]; // Execute JavaScript code directly
//             break;
//         case 'python':
//             command = 'python';
//             args = ['-c', code]; // Execute Python code directly
//             break;
//         // Add cases for other languages (e.g., Java, C++, etc.)
//         default:
//             ws.send(JSON.stringify({ type: 'error', data: 'Unsupported language.' }));
//             return;
//     }

//     const childProcess = spawn(command, args, options);

//     // Handle standard output
//     childProcess.stdout.on('data', (data) => {
//         ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
//     });

//     // Handle standard error
//     childProcess.stderr.on('data', (data) => {
//         ws.send(JSON.stringify({ type: 'error', data: data.toString() }));
//     });

//     // Notify WebSocket when the process exits
//     childProcess.on('close', (code) => {
//         ws.send(JSON.stringify({ type: 'exit', code, message: `Process exited with code ${code}` }));
//     });

//     // Handle errors during process spawn
//     childProcess.on('error', (err) => {
//         ws.send(JSON.stringify({ type: 'error', data: `Failed to spawn process: ${err.message}` }));
//     });

//     // Handle input from WebSocket and write to the process's stdin
//     ws.on('message', (message) => {
//         try {
//             const parsedMessage = JSON.parse(message);
//             if (parsedMessage.type === 'input' && parsedMessage.data) {
//                 childProcess.stdin.write(parsedMessage.data + '\n'); // Send user input to the process
//             }
//         } catch (error) {
//             ws.send(JSON.stringify({ type: 'error', data: 'Invalid input format.' }));
//         }
//     });

//     // Close stdin when the WebSocket closes
//     ws.on('close', () => {
//         childProcess.stdin.end();
//         console.log('WebSocket closed, ending process input stream.');
//     });
// };

// module.exports = { executeCodeWithUserInput };

//=========================================================================

// const Docker = require('dockerode');
// const docker = new Docker();

// const executeCode = async (code, language) => {
//   const image = getDockerImage(language);

//   const container = await docker.createContainer({
//     Image: image,
//     Cmd: ['sh', '-c', code],
//     Tty: true,
//     AttachStdout: true,
//     AttachStderr: true,
//   });

//   await container.start();

//   const output = await container.wait();
//   const logs = await container.logs({
//     stdout: true,
//     stderr: true,
//   });

//   await container.stop();
//   await container.remove();

//   return logs.toString();
// };

// const getDockerImage = (language) => {
//   switch (language) {
//     case 'python':
//       return 'python:3.9';
//     case 'javascript':
//       return 'node:14';
//     case 'java':
//       return 'openjdk:11';
//     case 'c++':
//       return 'gcc:latest';
//     default:
//       throw new Error(`Unsupported language: ${language}`);
//   }
// };

// module.exports = { executeCode };
