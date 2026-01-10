const Product = require('../models/Product');

// Fetch all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle Checkout Logic
exports.checkout = async (req, res, io) => {
    try {
        const { items, total } = req.body;
        // Logic to update stock and emit socket event
        for (const item of items) {
            const product = await Product.findByIdAndUpdate(
                item._id,
                { $inc: { stock: -1 } },
                { new: true }
            );
            if (product) {
                io.emit('stockUpdate', { id: product._id, newStock: product.stock });
            }
        }
        res.status(200).json({ success: true, message: "Order processed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};