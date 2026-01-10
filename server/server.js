require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Import Controllers
const productController = require('./controllers/productController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { origin: process.env.CLIENT_URL || "*" } 
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB (Using .env variable)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/simple-shop';
mongoose.connect(MONGO_URI)
    .then(() => console.log("🚀 High-End DB Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

// Routes
app.get('/api/products', productController.getProducts);
app.post('/api/checkout', (req, res) => productController.checkout(req, res, io));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🌍 Server active on port ${PORT}`));