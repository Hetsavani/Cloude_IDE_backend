// server/controllers/authController.js
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        user = new User({
            username,
            email,
            password,
        });

        await user.save();

        const payload = {
            userId: user.id,
        };

        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });

        res.status(201).json({ message: 'User registered successfully', token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during registration');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            userId: user.id,
        };

        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });

        res.json({ message: 'Login successful', token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during login');
    }
};

module.exports = { registerUser, loginUser };