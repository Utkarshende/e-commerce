const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// --- 1. GET ALL PRODUCTS ---
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- 2. ADD NEW PRODUCT (Admin Only) ---
router.post('/', auth, async (req, res) => {
  const { name, price, description, category, image, stock } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image,
      stock
    });

    const product = await newProduct.save();

    // Notify all clients that a new masterpiece arrived
    const io = req.app.get('socketio');
    if (io) io.emit('newProductAdded', product);

    res.json(product);
  } catch (err) {
    console.error("POST Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// --- 3. DELETE PRODUCT (Admin Only) ---
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await product.deleteOne();

    // Notify all clients to remove this card instantly
    const io = req.app.get('socketio');
    if (io) io.emit('productDeleted', req.params.id);

    res.json({ msg: 'Product removed from collection' });
  } catch (err) {
    console.error("DELETE Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// --- 4. UPDATE STOCK (Checkout) ---
router.post('/update-stock', auth, async (req, res) => {
  const { id, quantity } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ msg: 'Insufficient stock available' });
    }

    product.stock -= quantity;
    await product.save();

    // Broadcast the new stock level to everyone
    const io = req.app.get('socketio');
    if (io) io.emit('stockUpdate', { id: product._id, newStock: product.stock });

    res.json(product);
  } catch (err) {
    console.error("Stock Update Error:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;