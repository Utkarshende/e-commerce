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

server.listen(5000, () => console.log("Server: http://localhost:5000"));