require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const server = http.createServer(app);

// 1. Socket.io Configuration
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://your-frontend-link.onrender.com"], // Replace with your actual frontend URL
        methods: ["GET", "POST"]
    }
});

// 2. Middleware
app.use(express.json());

// Professional CORS setup
const allowedOrigins = ['http://localhost:5173', 'https://your-frontend-link.onrender.com'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 4. Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log(`📡 New Client Connected: ${socket.id}`);
    socket.on('disconnect', () => console.log('🔌 Client Disconnected'));
});

// 5. Routes Initialization
// Injecting 'io' into productRoutes so it can emit stock updates
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes(io));

// 6. Base Route for Health Check
app.get('/', (req, res) => {
    res.send('Luxe Store API is running...');
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});