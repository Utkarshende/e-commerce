const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://utkarsha:Utkarsha%401403@cluster0.hbdlkgl.mongodb.net/simple-shop')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

const Product = mongoose.model('Product', { 
    name: String, 
    price: Number, 
    stock: Number 
});

// Order Model
const Order = mongoose.model('Order', {
    items: Array,
    total: Number,
    date: { type: Date, default: Date.now }
});


app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/buy/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product && product.stock > 0) {
        product.stock -= 1;
        await product.save();
        io.emit('stockUpdate', { id: product._id, newStock: product.stock });
        res.json({ success: true });
    }
});
// Route: Create an Order
// ... existing imports and models ...

app.post('/api/checkout', async (req, res) => {
    try {
        const { items, total } = req.body;

        // 1. Save the Order in the database
        const newOrder = new Order({ items, total });
        await newOrder.save();

        // 2. Loop through items and reduce stock in MongoDB
        for (const item of items) {
            // Find product and subtract 1 from stock
            const product = await Product.findByIdAndUpdate(
                item._id, 
                { $inc: { stock: -1 } }, 
                { new: true }
            );

            // 3. Emit the change to all connected users via Socket.io
            if (product) {
                io.emit('stockUpdate', { id: product._id, newStock: product.stock });
            }
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Checkout failed" });
    }
});
server.listen(5000, () => console.log("Server: http://localhost:5000"));