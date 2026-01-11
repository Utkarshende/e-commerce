const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User Created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        
        // Generate a Token that lasts 1 day
        const token = jwt.sign({ id: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1d' });
        res.json({ token, user: { name: user.name, email: user.email, orders: user.orders } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};