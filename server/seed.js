require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Change this to your MongoDB Atlas URI if you are testing the cloud
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://utkarsha:Utkarsha%401403@cluster0.hbdlkgl.mongodb.net/simple-shop';

const seedData = [
    { 
        name: "iPhone 15 Pro", 
        price: 999, 
        stock: 10, 
        category: "Electronics", 
        description: "High-end titanium design with the most advanced iPhone camera yet.",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=500"
    },
    { 
        name: "MacBook Air M3", 
        price: 1299, 
        stock: 5, 
        category: "Laptops", 
        description: "Supercharged by M3 chip, incredibly thin and fast for all-day use.",
        image: "https://images.unsplash.com/photo-1517336714460-45788a1f4b8d?q=80&w=500"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to DB...");
        await Product.deleteMany({}); // Wipes old data
        await Product.insertMany(seedData);
        console.log("✨ Success: Database re-filled with descriptions!");
    } catch (err) {
        console.log("Error seeding:", err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedDB();