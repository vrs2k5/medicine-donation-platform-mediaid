const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, // e.g., 'Painkiller', 'Antibiotic'
  description: { type: String },
  manufacturer: { type: String },
  expiryDate: { type: Date },
  quantity: { type: Number, default: 1 },
  donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ngoStock: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending','approved','collected'], default: 'pending' },
  address: { type: String },
  pickupDate: { type: Date },
  pickupTime: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
