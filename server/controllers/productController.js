const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Try to load the file-based product dataset for fallback
let fileProducts = [];
try {
    const dataPath = path.join(__dirname, '..', 'data', 'products.js');
    // Require the file which exports the array
    // eslint-disable-next-line global-require, import/no-dynamic-require
    fileProducts = require(dataPath);
} catch (err) {
    fileProducts = [];
}

// Helper: slugify a name for basic id matching
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/products
exports.getProducts = async (req, res) => {
    const { category, q, limit = 0, page = 1 } = req.query;

    // Try DB first; fallback to file data on error
    try {
        const query = {};
        if (category) query.category = category;
        if (q) query.$or = [{ name: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];

        const cursor = Product.find(query);
        if (limit) cursor.limit(Number(limit)).skip(Number(limit) * (Number(page) - 1));
        const products = await cursor.exec();
        return res.status(200).json(products);
    } catch (err) {
        // Fallback to fileProducts
        let results = fileProducts.slice();
        if (category) results = results.filter((p) => p.category === category);
        if (q) results = results.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()));
        if (limit) results = results.slice((page - 1) * limit, (page - 1) * limit + Number(limit));
        return res.status(200).json(results);
    }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
    const { id } = req.params;

    // If it's a valid Mongo ObjectId, try DB
    try {
        const product = await Product.findById(id);
        if (product) return res.status(200).json(product);
    } catch (err) {
        // ignore and fallback to file
    }

    // Fallback: if id is numeric, treat as 1-based index; otherwise try slug match
    const numeric = Number(id);
    if (!Number.isNaN(numeric)) {
        const idx = Math.max(0, numeric - 1);
        if (fileProducts[idx]) return res.status(200).json(fileProducts[idx]);
    }

    const slug = id;
    const found = fileProducts.find((p) => slugify(p.name) === slug || slugify(p.name) === slugify(slug));
    if (found) return res.status(200).json(found);

    return res.status(404).json({ message: 'Product not found' });
};

exports.createCheckoutSession = async (req, res) => {
    const { cartItems } = req.body || {};

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: 'cartItems required' });
    }

    const line_items = cartItems.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
                images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?canceled=true`,
        });

        res.json({ id: session.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// This handles the Checkout and updates stock in DB (or just replies if file-based)
exports.checkout = async (req, res, io) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) return res.status(400).json({ message: 'Invalid items' });

        for (const item of items) {
            // If using DB, decrement stock and emit update
            try {
                const product = await Product.findByIdAndUpdate(item._id, { $inc: { stock: -1 } }, { new: true });
                if (product && io) io.emit('stockUpdate', { id: product._id, newStock: product.stock });
            } catch (err) {
                // DB update failed or not available — skip for file-based dataset
            }
        }

        return res.status(200).json({ success: true, message: 'Order processed' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};