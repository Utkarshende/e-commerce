require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const productData = require('./data/products'); // Import from the new file

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/simple-shop');
        await Product.deleteMany({}); 
        await Product.insertMany(productData); // Use the imported data
        console.log("✨ Database successfully synced with products.js!");
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedDB();