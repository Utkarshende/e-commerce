require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const server = http.createServer(app);

// 1. Socket.io Configuration (Updated with your Netlify URL)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://shop-e-mern.netlify.app"],
        methods: ["GET", "POST"]
    }
});

// 2. Middleware
app.use(express.json());

// 3. Updated CORS Setup (Ensures Netlify can talk to Render)
const allowedOrigins = [
    'http://localhost:5173', 
    'https://shop-e-mern.netlify.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'x-auth-token', 
        'Accept', 
        'Origin'
    ],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 5. Socket Logic
io.on('connection', (socket) => {
    console.log(`📡 New Client Connected: ${socket.id}`);
});

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes(io));

app.get('/', (req, res) => {
    res.send('Luxe Store API is running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});