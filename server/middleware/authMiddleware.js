const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Look for the token in the request headers
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, access denied' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        req.user = decoded.id; // Add user ID to the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};