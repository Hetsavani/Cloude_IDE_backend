// // server/controllers/fileController.js
// const User = require('../Models/User');

// const createFile = async (req, res) => {
//     const { filename, filepath, language, content, folderPath } = req.body; // folderPath is path to folder where file should be created
//     const user = req.user; // User from authMiddleware

//     if (!filename || !filepath) {
//         return res.status(400).json({ message: 'Filename and filepath are required' });
//     }

//     try {
//         const newFile = {
//             itemType: 'file',
//             name: filename,
//             language,
//             content,
//         };

//         let currentFolder = user.directory; // Start at root directory

//         if (folderPath) { // If folder path is provided, navigate to that folder
//             const pathParts = folderPath.split('/').filter(part => part !== ''); // Split and filter empty parts
//             for (const folderName of pathParts) {
//                 const foundFolder = currentFolder.items.find(item => item.type === 'folder' && item.name === folderName);
//                 if (!foundFolder) {
//                     return res.status(404).json({ message: `Folder '${folderName}' not found in path` });
//                 }
//                 currentFolder = foundFolder; // Move down to the next folder
//             }
//         }

//         currentFolder.items.push(newFile); // Add the new file to the items array of the target folder
//         await user.save(); // Save the updated user document

//         res.status(201).json({ message: 'File created successfully', file: newFile });

//     } catch (err) {
//         console.error('Error creating file:', err);
//         res.status(500).send('Server error creating file');
//     }
// };

// const getFileContent = async (req, res) => {
//     const { filepath } = req.params; // Filepath to identify the file
//     const user = req.user;

//     if (!filepath) {
//         return res.status(400).json({ message: 'Filepath is required' });
//     }

//     try {
//         let currentFolder = user.directory;
//         const pathParts = filepath.split('/').filter(part => part !== '');
//         let foundFile = null;

//         if (pathParts.length > 0) {
//             const filename = pathParts.pop(); // Last part is filename, rest is path to folder
//             for (const folderName of pathParts) {
//                 const foundFolder = currentFolder.items.find(item => item.type === 'folder' && item.name === folderName);
//                 if (!foundFolder) {
//                     return res.status(404).json({ message: `Folder '${folderName}' not found in path` });
//                 }
//                 currentFolder = foundFolder;
//             }
//             foundFile = currentFolder.items.find(item => item.type === 'file' && item.name === filename);
//         } else { // If only filename is provided (at root)
//             foundFile = currentFolder.items.find(item => item.type === 'file' && item.name === filepath); // filepath here is actually filename at root
//         }

//         if (!foundFile) {
//             return res.status(404).json({ message: 'File not found' });
//         }

//         res.json({ content: foundFile.content });

//     } catch (err) {
//         console.error('Error getting file content:', err);
//         res.status(500).send('Server error getting file content');
//     }
// };

// const updateFileContent = async (req, res) => {
//     const { filepath } = req.params;
//     const { content } = req.body;
//     const user = req.user;

//     if (!filepath || content === undefined) {
//         return res.status(400).json({ message: 'Filepath and content are required' });
//     }

//     try {
//         let currentFolder = user.directory;
//         const pathParts = filepath.split('/').filter(part => part !== '');
//         let foundFile = null;

//         if (pathParts.length > 0) {
//             const filename = pathParts.pop();
//             for (const folderName of pathParts) {
//                 const foundFolder = currentFolder.items.find(item => item.type === 'folder' && item.name === folderName);
//                 if (!foundFolder) {
//                     return res.status(404).json({ message: `Folder '${folderName}' not found in path` });
//                 }
//                 currentFolder = foundFolder;
//             }
//             foundFile = currentFolder.items.find(item => item.type === 'file' && item.name === filename);
//         } else {
//             foundFile = currentFolder.items.find(item => item.type === 'file' && item.name === filepath); // filepath is filename at root
//         }

//         if (!foundFile) {
//             return res.status(404).json({ message: 'File not found' });
//         }

//         foundFile.content = content; // Update file content
//         await user.save();

//         res.json({ message: 'File content updated successfully' });

//     } catch (err) {
//         console.error('Error updating file content:', err);
//         res.status(500).send('Server error updating file content');
//     }
// };

// const createFolder = async (req, res) => {
//     const { folderName, parentFolderPath } = req.body; // parentFolderPath: path to folder where new folder should be created
//     const user = req.user;

//     if (!folderName) {
//         return res.status(400).json({ message: 'Folder name is required' });
//     }

//     try {
//         const newFolder = {
//             itemType: 'folder',
//             name: folderName,
//             items: [], // New folder starts empty
//         };

//         let currentFolder = user.directory; // Start at root

//         if (parentFolderPath) {
//             const pathParts = parentFolderPath.split('/').filter(part => part !== '');
//             for (const folderPartName of pathParts) {
//                 const foundFolder = currentFolder.items.find(item => item.type === 'folder' && item.name === folderPartName);
//                 if (!foundFolder) {
//                     return res.status(404).json({ message: `Parent folder '${folderPartName}' not found in path` });
//                 }
//                 currentFolder = foundFolder;
//             }
//         }

//         currentFolder.items.push(newFolder);
//         await user.save();

//         res.status(201).json({ message: 'Folder created successfully', folder: newFolder });

//     } catch (err) {
//         console.error('Error creating folder:', err);
//         res.status(500).send('Server error creating folder');
//     }
// };

// module.exports = { createFile, getFileContent, updateFileContent, createFolder };

const User = require("../Models/User");
const fs = require("node:fs");

const createFile = async (req, res) => {
  const { filename, language, content, folderPath } = req.body;
  const user = req.user;
  console.log("Creating file")
  console.log("folderPath:" + folderPath+"ef")
  if (!filename) {
    return res
      .status(400)
      .json({ message: "Filename is required" });
  }

  try {
    const newFile = {
      itemType: "file",
      data: {
        name: filename,
        language: language || "plaintext",
        content: content || "",
        type: "file",
      },
    };

    let currentFolder = user.directory;
    if (!folderPath || folderPath === "") {  // Root folder case
      currentFolder.items.push(newFile);
      user.markModified("directory");
      await user.save();
      return res.status(201).json({ message: "File created successfully", file: newFile });
    }
    const pathParts = folderPath.split("/").filter((part) => part !== "");

    // Navigate to the correct folder
    for (const folderName of pathParts) {
      const foundFolder = currentFolder.items.find(
        (item) => item.itemType === "folder" && item.data.name === folderName
      );
      if (!foundFolder) {
        return res
          .status(404)
          .json({ message: `Folder '${folderName}' not found in path` });
      }
      currentFolder = foundFolder.data;
    }

    // Check if file already exists
    const fileExists = currentFolder.items.some(
      (item) => item.itemType === "file" && item.data.name === filename
    );
    if (fileExists) {
      return res
        .status(400)
        .json({ message: "File already exists in this folder" });
    }
    console.log("Before adding file:", currentFolder.items);

    // Add the new file to the current folder
    currentFolder.items.push(newFile);

    console.log("After adding file:", currentFolder.items);

    // Mark the modified path for Mongoose to track changes
    user.markModified("directory");
    // Save the updated user document
    await user.save();

    res
      .status(201)
      .json({ message: "File created successfully", file: newFile });
  } catch (err) {
    console.error("Error creating file:", err);
    res.status(500).json({ message: "Server error creating file" });
  }
};

const getFileContent = async (req, res) => {
  const { filepath } = req.params;
  const user = req.user;
  console.log(filepath);
  try {
    let currentFolder = user.directory;
    const pathParts = filepath.split("/").filter((part) => part !== "");
    let fileContent = null;

    for (let i = 0; i < pathParts.length; i++) {
      const pathPart = pathParts[i];
      const item = currentFolder.items.find(
        (item) => item.data.name === pathPart
      );

      if (!item) {
        return res.status(404).json({ message: "File not found" });
      }

      if (item.itemType === "folder") {
        currentFolder = item.data;
      } else if (item.itemType === "file" && i === pathParts.length - 1) {
        fileContent = item.data.content;
      }
    }

    if (fileContent === null) {
      return res.status(404).json({ message: "File not found" });
    }
    console.log(fileContent);
    res.json({ content: fileContent });
  } catch (error) {
    console.error("Error getting file content:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateFileContent = async (req, res) => {
  const { filepath } = req.params;
  const { content } = req.body;
  const user = req.user;
  console.log(content);
  let fileUpdated = false;
  try {
    let currentFolder = user.directory;
    const pathParts = filepath.split("/").filter((part) => part !== "");

    for (let i = 0; i < pathParts.length; i++) {
      const pathPart = pathParts[i];
      const item = currentFolder.items.find(
        (item) => item.data.name === pathPart
      );

      if (!item) {
        return res.status(404).json({ message: "File not found" });
      }

      if (item.itemType === "folder") {
        currentFolder = item.data;
      } else if (item.itemType === "file" && i === pathParts.length - 1) {
        item.data.content = content;
        fileUpdated = true;
      }
    }
    if (!fileUpdated) {
      return res.status(400).json({ message: "No file was updated" });
    }
    user.markModified("directory");  // ✅ Mark the field as modified
    await user.save();
    res.json({ message: "File content updated successfully" });
  } catch (error) {
    console.error("Error updating file content:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createFolder = async (req, res) => {
  const { folderName, folderPath } = req.body;
  console.log(folderName);
  console.log(folderPath);
  const user = req.user;

  if (!folderName) {
    return res.status(400).json({ message: "Folder name is required" });
  }

  try {
    const newFolder = {
      itemType: "folder",
      data: {
        name: folderName,
        items: [],
      },
    };

    let currentFolder = user.directory;

    if (folderPath) {
      const pathParts = folderPath.split("/").filter((part) => part !== "");
      for (const folderName of pathParts) {
        const foundFolder = currentFolder.items.find(
          (item) => item.itemType === "folder" && item.data.name === folderName
        );
        if (!foundFolder) {
          return res
            .status(404)
            .json({ message: `Folder '${folderName}' not found in path` });
        }
        currentFolder = foundFolder.data;
        console.log(foundFolder)
      }
    }
    currentFolder.items.push(newFolder);
    user.markModified("directory");
    await user.save();

    res.status(201).json({ message: "Folder created successfully", folder: newFolder });
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(500).send("Server error creating folder");
  }
};
const deleteFile = async (req, res) => {
  const { filepath } = req.params;
  const user = req.user;
  console.log("delete : " + filepath)
  try {
    let currentFolder = user.directory;
    const pathParts = filepath.split("/").filter((part) => part !== "");

    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderName = pathParts[i];
      const foundFolder = currentFolder.items.find(
        (item) => item.itemType === "folder" && item.data.name === folderName
      );
      if (!foundFolder) {
        return res.status(404).json({ message: `Folder '${folderName}' not found` });
      }
      currentFolder = foundFolder.data;
    }

    const fileIndex = currentFolder.items.findIndex(
      (item) => item.itemType === "file" && item.data.name === pathParts[pathParts.length - 1]
    );

    if (fileIndex === -1) {
      return res.status(404).json({ message: "File not found" });
    }

    // Remove the file from the directory structure
    currentFolder.items.splice(fileIndex, 1);

    user.markModified("directory");
    await user.save();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server error deleting file" });
  }
};

// ✅ Delete a Folder (Recursively)
const deleteFolder = async (req, res) => {
  const { folderpath } = req.params;
  const user = req.user;
  console.log("DeleteFolder : ", folderpath)
  try {
    let currentFolder = user.directory;
    const pathParts = folderpath.split("/").filter((part) => part !== "");

    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderName = pathParts[i];
      const foundFolder = currentFolder.items.find(
        (item) => item.itemType === "folder" && item.data.name === folderName
      );
      if (!foundFolder) {
        return res.status(404).json({ message: `Folder '${folderName}' not found` });
      }
      currentFolder = foundFolder.data;
    }

    const folderIndex = currentFolder.items.findIndex(
      (item) => item.itemType === "folder" && item.data.name === pathParts[pathParts.length - 1]
    );

    if (folderIndex === -1) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Remove the folder and all its contents
    currentFolder.items.splice(folderIndex, 1);

    user.markModified("directory");
    await user.save();

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Server error deleting folder" });
  }
};

module.exports = {
  createFile,
  getFileContent,
  updateFileContent,
  createFolder,
  deleteFile,
  deleteFolder,
};