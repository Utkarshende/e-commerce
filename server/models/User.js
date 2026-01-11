const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    orders: { type: Array, default: [] } // User's private history
});

module.exports = mongoose.model('User', UserSchema);