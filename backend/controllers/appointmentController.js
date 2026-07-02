const Appointment = require('../models/Appointment');

exports.requestAppointment = async (req, res) => {
  try {
    const { requestedDate, notes } = req.body;
    const appt = new Appointment({ ngo: req.user._id, requestedDate, adminNotes: notes });
    await appt.save();
    res.json({ message: 'Appointment requested', appt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNGOAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find({ ngo: req.user._id }).sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find().populate('ngo').sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveAppointment = async (req, res) => {
  try {
    const { appointmentId, scheduledDate, adminNotes } = req.body;
    const appt = await Appointment.findById(appointmentId);
    if (!appt) return res.status(404).json({ message: 'Not found' });
    appt.approved = true;
    appt.scheduledDate = scheduledDate;
    appt.adminNotes = adminNotes;
    await appt.save();
    res.json({ message: 'Approved', appt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectAppointment = async (req, res) => {
  try {
    const { appointmentId, adminNotes } = req.body;
    const appt = await Appointment.findById(appointmentId);
    if (!appt) return res.status(404).json({ message: 'Not found' });
    appt.approved = false;
    appt.adminNotes = adminNotes;
    await appt.save();
    res.json({ message: 'Rejected', appt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
