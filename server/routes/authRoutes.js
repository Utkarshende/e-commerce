const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Debugging: This will print the available functions in your console when the server starts.
// If it prints { login: [Function], register: [Function] }, it's working perfectly.
console.log('Auth Controller loaded:', authController);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req, res, next) => {
    if (typeof authController.register !== 'function') {
        return res.status(500).send('Register handler is missing');
    }
    authController.register(req, res, next);
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', (req, res, next) => {
    if (typeof authController.login !== 'function') {
        return res.status(500).send('Login handler is missing');
    }
    authController.login(req, res, next);
});

module.exports = router;