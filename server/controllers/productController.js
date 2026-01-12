const Product = require('../models/Product');
const path = require('path');

// Fallback logic for file-based products
let fileProducts = [];
try {
    const dataPath = path.join(__dirname, '..', 'data', 'products.js');
    fileProducts = require(dataPath);
} catch (err) {
    fileProducts = [];
}

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// 1. GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
    const { category, q, limit = 0, page = 1 } = req.query;
    try {
        const query = {};
        if (category) query.category = category;
        if (q) query.$or = [{ name: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];

        const cursor = Product.find(query);
        if (limit) cursor.limit(Number(limit)).skip(Number(limit) * (Number(page) - 1));
        const products = await cursor.exec();
        return res.status(200).json(products);
    } catch (err) {
        let results = fileProducts.slice();
        if (category) results = results.filter((p) => p.category === category);
        if (q) results = results.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
        return res.status(200).json(results);
    }
};

// 2. UPDATE STOCK (Used by your QRModal Confirm button)
exports.updateStock = async (req, res, io) => {
    const { id, quantity } = req.body;
    
    try {
        // Find product and subtract the quantity
        // { $inc: { stock: -quantity } } subtracts the number safely
        const product = await Product.findByIdAndUpdate(
            id, 
            { $inc: { stock: -Number(quantity) } }, 
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // EMIT REAL-TIME UPDATE
        if (io) {
            io.emit('stockUpdate', { id: product._id, newStock: product.stock });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Stock updated", 
            newStock: product.stock 
        });
    } catch (err) {
        console.error("Stock Update Error:", err);
        return res.status(500).json({ message: "Database update failed" });
    }
};

// 3. GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (product) return res.status(200).json(product);
    } catch (err) { /* fallback */ }

    const found = fileProducts.find((p, idx) => 
        (idx + 1 === Number(id)) || slugify(p.name) === id
    );
    
    if (found) return res.status(200).json(found);
    return res.status(404).json({ message: 'Product not found' });
};