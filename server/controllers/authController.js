const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // 2. Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // 3. Create the JWT
        // We put the user's ID inside the "payload"
        const payload = { id: user._id };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, // Using the key from .env
            { expiresIn: '24h' }    // Token expires in 1 day
        );

        // 4. Send response
        res.json({ 
            token, 
            user: { 
                id: user._id,
                name: user.name, 
                email: user.email, 
                orders: user.orders 
            } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};