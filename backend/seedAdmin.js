require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  await connectDB(process.env.MONGO_URI);
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log('Admin exists');
    process.exit(0);
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
  const admin = new User({ name: 'Admin', email: process.env.ADMIN_EMAIL, passwordHash: hash, role: 'admin' });
  await admin.save();
  console.log('Admin created:', process.env.ADMIN_EMAIL);
  process.exit(0);
};

createAdmin().catch(err => { console.error(err); process.exit(1); });
