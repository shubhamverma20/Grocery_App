require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grocery_app');
        console.log('Connected to DB...');

        const adminEmail = 'admin@freshcart.com';
        const hashedPassword = await bcrypt.hash('admin123', 12);

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin already exists.');
            process.exit();
        }

        const admin = new User({
            username: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('✅ Admin Account Created!');
        console.log('Email: admin@freshcart.com');
        console.log('Password: admin123');
        process.exit();
    } catch (err) {
        console.error('❌ Error Creating Admin:', err);
        process.exit(1);
    }
};

createAdmin();
