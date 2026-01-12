const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Signature', 'Essentials', 'Limited'] 
  },
  image: { type: String, required: true },
  backImage: { type: String }, // Added this field for the hover swap
  stock: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('product', ProductSchema);