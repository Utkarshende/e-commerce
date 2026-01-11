const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware'); // Import the shield

module.exports = (io) => {
    // Only logged in users can GET products
    router.get('/', auth, productController.getProducts);

    // Only logged in users can UPDATE stock
    router.post('/update-stock', auth, (req, res) => 
        productController.updateStock(req, res, io)
    );

    return router;
};