const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// 1. Socket.io Setup with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your frontend URL
    methods: ["GET", "POST", "DELETE", "PUT"]
  }
});

// 2. CRITICAL: Attach socketio to the app so routes can use it
app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB - Luxury Vault Secured'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 4. Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('Client connected to socket:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 5. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));

// Root Route for Health Check
app.get('/', (req, res) => {
  res.send('Luxe Boutique Server is Operational.');
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});