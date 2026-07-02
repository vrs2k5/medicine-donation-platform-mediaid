const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  status: { type: String, enum: ['pending', 'approved', 'collected'], default: 'pending' },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // assigned NGO
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
