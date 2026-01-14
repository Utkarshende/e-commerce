require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/simple-shop';

(async function fixPasswords(){
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to DB for password fix');

    const users = await User.find();
    for (const user of users) {
      const pwd = user.password || '';
      // If password doesn't look like a bcrypt hash, hash it
      if (!pwd.startsWith('$2')) {
        console.log(`Hashing password for ${user.email}`);
        const hashed = await bcrypt.hash(pwd, 10);
        user.password = hashed;
        await user.save();
      } else {
        console.log(`Already hashed: ${user.email}`);
      }
    }

    console.log('Password fix completed');
  } catch (err) {
    console.error('Error fixing passwords', err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
})();
