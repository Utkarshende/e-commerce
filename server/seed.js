const mongoose = require('mongoose');

// Use 127.0.0.1 instead of localhost
const mongoURI = 'mongodb://127.0.0.1:27017/simple-shop';

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected for seeding..."))
    .catch(err => console.error("Could not connect to MongoDB:", err));

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
    try {
        await Product.deleteMany({}); 
        await Product.insertMany(seedData);
        console.log("✅ Database Seeded Successfully!");
    } catch (error) {
        console.error("❌ Seeding Error:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();