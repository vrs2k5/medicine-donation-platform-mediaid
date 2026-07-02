const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','ngo','member'], default: 'member' },
  blocked: { type: Boolean, default: false },
  mobile: { type: String },
  location: { type: String },
  securityQuestion: { type: String, required: true },
  securityAnswerHash: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
