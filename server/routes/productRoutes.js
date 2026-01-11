const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

module.exports = (io) => {
    router.get('/', productController.getProducts);
    // New endpoint for QR payment confirmation stock update
    router.post('/update-stock', (req, res) => productController.updateStock(req, res, io));
    return router;
};