// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const config = require("../config/authConfig");
const User = require("../Models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log(token);
  if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    console.log("token is " + token);
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId); // Fetch user from DB
    if (!user) {
      return res.status(401).json({ message: "Invalid token, user not found" });
    }
    req.user = user; // Attach user object to request
    // console.log(token);

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
