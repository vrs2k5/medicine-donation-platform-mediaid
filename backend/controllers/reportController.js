const Report = require('../models/Report');
const Medicine = require('../models/Medicine');
const User = require('../models/User');

exports.generateMonthlyReport = async (req, res) => {
  const { month } = req.params; // e.g., '2023-10'
  try {
    const start = new Date(`${month}-01`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    const totalDonations = await Medicine.countDocuments({
      createdAt: { $gte: start, $lt: end }
    });

    const totalNGOs = await User.countDocuments({ role: 'ngo' });
    const totalMembers = await User.countDocuments({ role: 'member' });

    const report = new Report({
      month,
      totalDonations,
      totalNGOs,
      totalMembers,
      data: {} // can add more
    });

    await report.save();
    res.json({ message: 'Report generated', report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ month: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReportByMonth = async (req, res) => {
  const { month } = req.params;
  try {
    const report = await Report.findOne({ month });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
