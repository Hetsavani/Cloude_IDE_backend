// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const config = require("../config/authConfig");
const User = require('../Models/User');


admin.initializeApp({
  credential: admin.credential.cert(require("../codevortex-f9667-firebase-adminsdk-fbsvc-04726e35f2.json")),
});

router.post("/google-login", async (req, res) => {
  try {
    // console.log("point 0")
    const { token } = req.body;
    // console.log(token)
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Find or create user in database
    console.log("point 1")
    let user = await User.findOne({ email: decodedToken.email });
    if (!user) {
        const randomPassword = Math.random().toString(36).slice(-8); // Generate random password
      user = new User({ username: decodedToken.name, email: decodedToken.email,password : randomPassword});
      await user.save();
    }
    console.log("point 2")
    // Generate backend JWT token
    const jwtToken = jwt.sign({ userId: user._id }, config.jwtSecret);

    res.json({ token: jwtToken, name: user.username });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Google authentication failed" });
  }
});

// POST /api/auth/register
router.post('/register', authController.registerUser);

// POST /api/auth/login
router.post('/login', authController.loginUser);

module.exports = router;