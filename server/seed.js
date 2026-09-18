require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    const email = 'admin@portal.com';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    let user = await User.findOne({ email });
    if (user) {
      user.password = hashedPassword;
      user.role = 'admin';
      user.name = 'System Admin';
      await user.save();
      console.log(`✅ Admin account updated/reset successfully!`);
    } else {
      user = await User.create({
        name: 'System Admin',
        email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ New Admin user created successfully!');
    }

    console.log('   Email:    admin@portal.com');
    console.log('   Password: admin123');
    console.log('   Role:     admin');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
