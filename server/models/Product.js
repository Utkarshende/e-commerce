const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String },
    category: { type: String, default: "General" },
    description: { type: String, default: "No description available" } // Ensure this exists!
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);