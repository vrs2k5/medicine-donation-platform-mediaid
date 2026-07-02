const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Donation = require('../models/Medicine');

exports.getUsers = async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(users);
};

exports.blockUser = async (req, res) => {
  const { userId, block } = req.body;
  await User.findByIdAndUpdate(userId, { blocked: !!block });
  res.json({ message: `User ${block ? 'blocked' : 'unblocked'}` });
};

exports.deleteMedicine = async (req, res) => {
  const { medicineId } = req.body;
  await Medicine.findByIdAndDelete(medicineId);
  res.json({ message: 'Medicine deleted' });
};

exports.monthlyReport = async (req, res) => {
  const start = new Date(req.query.start || new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const end = new Date(req.query.end || new Date());
  const donations = await Medicine.find({ createdAt: { $gte: start, $lte: end } }).populate('donatedBy');
  res.json({ start, end, count: donations.length, donations });
};
