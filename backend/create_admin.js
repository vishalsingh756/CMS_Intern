import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cms_db';

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin_secure_password';
    const username = process.env.ADMIN_USERNAME || 'admin';
    const firstName = process.env.ADMIN_FIRSTNAME || 'Admin';

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.warn('⚠️ WARNING: Using default admin credentials. Set ADMIN_EMAIL and ADMIN_PASSWORD in environment variables.');
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      existing.role = 'admin';
      existing.password = password; // Pass plain text, pre('save') will hash it
      existing.username = username;
      existing.firstName = firstName;
      await existing.save();
      console.log('User already existed. Updated role to admin and updated credentials.');
    } else {
      const admin = new User({
        username: username,
        email: email,
        password: password, // Pass plain text, pre('save') will hash it
        role: 'admin',
        firstName: firstName,
      });
      await admin.save();
      console.log('Admin account created successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();

