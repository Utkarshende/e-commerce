const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/simple-shop');

const Product = mongoose.model('Product', { 
    name: String, 
    price: Number, 
    stock: Number 
});

const seedData = [
    { name: "iPhone 15", price: 999, stock: 10 },
    { name: "MacBook Air", price: 1200, stock: 5 },
    { name: "AirPods Pro", price: 250, stock: 15 }
];

const seedDB = async () => {
    await Product.deleteMany({}); // Clears existing data
    await Product.insertMany(seedData);
    console.log("Database Seeded with Products!");
    process.exit();
};

seedDB();