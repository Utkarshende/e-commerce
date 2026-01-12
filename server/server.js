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
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'], // Explicitly allow BOTH
    credentials: true,
    optionsSuccessStatus: 200 
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
// @route   POST api/products
// @desc    Add a new product to the collection
// @access  Private/Admin
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
    
    // Emit socket event so the frontend updates in real-time for everyone
    const io = req.app.get('socketio');
    io.emit('newProductAdded', product);

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await product.deleteOne();

    // Notify all clients via socket
    const io = req.app.get('socketio');
    io.emit('productDeleted', req.params.id);

    res.json({ msg: 'Product removed from collection' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});