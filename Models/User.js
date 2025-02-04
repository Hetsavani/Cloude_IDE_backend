const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define embedded File Schema
const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    language: {
        type: String,
        trim: true, // e.g., 'javascript', 'python', 'plaintext'
        default: 'plaintext', // Default language if not specified
    },
    content: {
        type: String,
        default: '', // Empty content by default
    },
    type: {
        type: String,
        default: 'file', // Explicitly set type to 'file'
        immutable: true, // Type should not be changed after creation
    }
}, { _id: false }); // Disable _id for embedded schema

// Define embedded Folder Schema (Recursive)
const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        default: 'folder', // Explicitly set type to 'folder'
        immutable: true, // Type should not be changed after creation
    },
    // items: [{ // Array to hold files and folders within this folder
    //     type: mongoose.Schema.Types.Mixed, // Allow mixed types (FileSchema or FolderSchema)
    //     discriminatorKey: 'itemType', // Key to differentiate between file and folder
    // }]
    items: [ // Corrected: Document Array definition
        {
            itemType: { // Discriminator key field (important to define it *within* the schema)
                type: String,
                required: true,
                enum: ['file', 'folder'], // Optional: Restrict itemType values
            },
            data: mongoose.Schema.Types.Mixed, // Use Mixed to store either fileSchema or folderSchema data
        }
    ]
}, { _id: false }); // Disable _id for embedded schema

// Define User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    directory: { // User's root directory - starts the file system tree
        type: folderSchema,
        default: { // Default root directory structure
            name: 'root', // Root directory name
            type: 'folder',
            items: [], // Initially empty directory
        },
    },
}, {
    timestamps: true,
});

// Discriminators for Mixed type in folderSchema.items
folderSchema.path('items').discriminator('file', fileSchema);
folderSchema.path('items').discriminator('folder', folderSchema); // Recursive discriminator for folders

// Middleware to hash password before saving a user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;