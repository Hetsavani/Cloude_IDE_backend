// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// POST /api/auth/register
router.post('/register', authController.registerUser);

// POST /api/auth/login
router.post('/login', authController.loginUser);

module.exports = router;