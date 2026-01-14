const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash password then create new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // 3. Create JWT Token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. Send response
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).json({ message: "Server error during registration" });
    }
};

/**
 * @desc Authenticate user & get token
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 3. Create JWT Token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. Send response (include orders for the frontend history)
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                orders: user.orders || []
            }
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Server error during login" });
    }
};