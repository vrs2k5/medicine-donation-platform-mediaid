const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedDate: { type: Date },
  approved: { type: Boolean, default: false },
  scheduledDate: { type: Date },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
