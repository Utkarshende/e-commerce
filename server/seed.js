const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://utkarsha:Utkarsha%401403@cluster0.hbdlkgl.mongodb.net/simple-shop';

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
        console.log("Connecting to MongoDB...");
        // We wait (await) for the connection to be 100% ready
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB Connected!");

        console.log("Clearing old products...");
        await Product.deleteMany({}); 

        console.log("Inserting new products...");
        await Product.insertMany(seedData);

        console.log("✨ Database Seeded Successfully!");
    } catch (error) {
        console.error("❌ Seeding Error:", error.message);
        console.log("\nTIP: Make sure your MongoDB Service is running in Windows Services.");
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

seedDB();