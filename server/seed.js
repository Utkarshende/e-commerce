require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Ensure this path is correct

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/simple-shop';

const seedData = [
    { 
        name: "iPhone 15 Pro", 
        price: 999, 
        stock: 10, 
        category: "Electronics", 
        description: "Experience the power of Titanium with the new A17 Pro chip and a pro camera system.",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=500&auto=format&fit=crop"
    },
    { 
        name: "MacBook Air M3", 
        price: 1299, 
        stock: 5, 
        category: "Laptops", 
        description: "Strikingly thin and fast so you can work, play or create anywhere with the M3 chip.",
        image: "https://images.unsplash.com/photo-1517336714460-45788a1f4b8d?q=80&w=500&auto=format&fit=crop"
    },
    { 
        name: Sony WH-1000XM5", 
        price: 399, 
        stock: 15, 
        category: "Accessories", 
        description: "Industry-leading noise cancellation and magnificent sound quality for music lovers.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Database...");

        // 1. Delete everything first to avoid "Ghost Data"
        await Product.deleteMany({}); 
        console.log("Cleared old products.");

        // 2. Insert new data
        await Product.insertMany(seedData);
        console.log("✨ Database Seeded with Descriptions!");

    } catch (error) {
        console.error("Seeding Error:", error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedDB();