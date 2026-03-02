require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    const email = 'admin@portal.com';

    // Check if user already exists to avoid duplicates
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User ${email} already exists. Skipping insert.`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'System Admin',
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ User inserted successfully!');
    console.log('   Email:    admin@portal.com');
    console.log('   Password: admin123');
    console.log('   Role:     admin');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
