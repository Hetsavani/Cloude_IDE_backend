<<<<<<< HEAD
// server/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('../Controllers/fileController');
const authMiddleware = require('../Middleware/authMiddleware');
const http = require('http');
const { app } = require('../server');

function generateFileTree(directory) {
  const tree = {}

  function buildTree(dir) {
    const result = {}
    for (const item of dir.items) {
      if (item.itemType === "file") {
        result[item.data.name] = null // Files are leaf nodes
      } else if (item.itemType === "folder") {
        result[item.data.name] = buildTree(item.data) // Recursively build subtree for folders
      }
    }
    return result
  }
  //   console.log(directory)
  return buildTree(directory)
}

router.get('/get-tree', authMiddleware, async (req, res) => {
  try {
    // The user object is already attached to req by authMiddleware
    const user = req.user
    // console.log("efrgthyj")
    // Generate the file tree starting from the user's root directory
    const fileTree = generateFileTree(user.directory)
    // console.log("efrgthyj123456")

    // Send the file tree as a response
    res.json({ tree: fileTree });
  } catch (error) {
    console.error("Error generating file tree:", error)
    res.status(500).json({ message: "Error generating file tree" })
  }
});
// POST /api/files/create
router.post('/create', authMiddleware, fileController.createFile);

// GET /api/files/:filepath/content
router.delete("/file/:filepath(*)", authMiddleware, fileController.deleteFile);

// Route to delete a folder
router.delete("/folder/:folderpath(*)", authMiddleware, fileController.deleteFolder);

router.get('/:filepath(*)/content', authMiddleware, fileController.getFileContent);

// PUT /api/files/:filepath/content
router.put('/:filepath(*)/content', authMiddleware, fileController.updateFileContent);

// POST /api/files/folder
router.post('/folder', authMiddleware, fileController.createFolder);

=======
// server/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('../Controllers/fileController');
const authMiddleware = require('../Middleware/authMiddleware');
const http = require('http');
const { app } = require('../server');

function generateFileTree(directory) {
  const tree = {}

  function buildTree(dir) {
    const result = {}
    for (const item of dir.items) {
      if (item.itemType === "file") {
        result[item.data.name] = null // Files are leaf nodes
      } else if (item.itemType === "folder") {
        result[item.data.name] = buildTree(item.data) // Recursively build subtree for folders
      }
    }
    return result
  }
  //   console.log(directory)
  return buildTree(directory)
}

router.get('/get-tree', authMiddleware, async (req, res) => {
  try {
    // The user object is already attached to req by authMiddleware
    const user = req.user
    // console.log("efrgthyj")
    // Generate the file tree starting from the user's root directory
    const fileTree = generateFileTree(user.directory)
    // console.log("efrgthyj123456")

    // Send the file tree as a response
    res.json({ tree: fileTree });
  } catch (error) {
    console.error("Error generating file tree:", error)
    res.status(500).json({ message: "Error generating file tree" })
  }
});
// POST /api/files/create
router.post('/create', authMiddleware, fileController.createFile);

// GET /api/files/:filepath/content
router.delete("/file/:filepath(*)", authMiddleware, fileController.deleteFile);

// Route to delete a folder
router.delete("/folder/:folderpath(*)", authMiddleware, fileController.deleteFolder);

router.get('/:filepath(*)/content', authMiddleware, fileController.getFileContent);

// PUT /api/files/:filepath/content
router.put('/:filepath(*)/content', authMiddleware, fileController.updateFileContent);

// POST /api/files/folder
router.post('/folder', authMiddleware, fileController.createFolder);

>>>>>>> Het
module.exports = router;