const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  month: { type: String, required: true }, // e.g., '2023-10'
  totalDonations: { type: Number, default: 0 },
  totalNGOs: { type: Number, default: 0 },
  totalMembers: { type: Number, default: 0 },
  data: { type: Object } // additional data
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
