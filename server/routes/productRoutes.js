const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// We wrap this in a function so we can pass 'io' (Socket.io) 
// from server.js down to the checkout logic
module.exports = (io) => {
    
    // GET: http://localhost:5000/api/products
    router.get('/', productController.getProducts);

    // GET: http://localhost:5000/api/products/:id
    router.get('/:id', productController.getProductById);

    // POST: http://localhost:5000/api/products/checkout
    // (Existing manual checkout)
    router.post('/checkout', (req, res) => productController.checkout(req, res, io));

    // POST: http://localhost:5000/api/products/create-checkout-session
    // (New Stripe checkout)
    router.post('/create-checkout-session', productController.createCheckoutSession);

    return router;
};