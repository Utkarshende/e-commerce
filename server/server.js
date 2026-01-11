require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const productController = require('./controllers/productController');
const productRoutes = require('./routes/productRoutes'); // Import the new file

const app = express();
const server = http.createServer(app);

// --- CORRECTION START ---
// We define which URLs are allowed to talk to our backend
const allowedOrigins = [
    "http://localhost:5173", // Your local Vite dev server
    "https://your-netlify-site-name.netlify.app" // Your future production site
];

const io = new Server(server, { 
    cors: { 
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl) or if it's in our list
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"]
    } 
});

// Apply CORS to standard Express routes too
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
// --- CORRECTION END ---

app.use(express.json());
app.use('/api/products', productRoutes(io));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/simple-shop';
mongoose.connect(MONGO_URI)
    .then(() => console.log("🚀 High-End DB Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

app.get('/api/products', productController.getProducts);
app.post('/api/checkout', (req, res) => productController.checkout(req, res, io));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🌍 Server active on port ${PORT}`));