const Medicine = require('../models/Medicine');
const User = require('../models/User');
const axios = require('axios');
const { sendSMS } = require('../utils/smsService');

exports.createDonation = async (req, res) => {
  try {
    const { name, manufacturer, expiryDate, quantity, address, pickupDate, pickupTime } = req.body;

    // Validate expiry date - must not be in the past
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for comparison
      if (expiry < today) {
        return res.status(400).json({ message: 'Expiry date cannot be in the past.' });
      }
    }

    const med = new Medicine({
      name,
      manufacturer,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      quantity: quantity || 1,
      donatedBy: req.user._id,
      status: 'pending',
      address,
      pickupDate: pickupDate ? new Date(pickupDate) : null,
      pickupTime
    });
    await med.save();

    // Send SMS notification to the donor
    try {
      await sendSMS(req.user.mobile, `Thank you for donating ${name}. Your donation has been recorded and is pending approval.`);
    } catch (smsErr) {
      console.error('SMS sending failed:', smsErr);
      // Do not fail donation if SMS fails
    }

    res.json({ message: 'Donation created', medicine: med });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMemberDonations = async (req, res) => {
  try {
    const donations = await Medicine.find({ donatedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNGOStock = async (req, res) => {
  try {
    const stock = await Medicine.find({ ngoStock: req.user._id }).populate('donatedBy', 'name').sort({ expiryDate: 1 });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingDonations = async (req, res) => {
  try {
    const pending = await Medicine.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignToNGO = async (req, res) => {
  try {
    const { medicineId, ngoId } = req.body;
    const med = await Medicine.findById(medicineId).populate('donatedBy', 'name mobile').populate('ngoStock', 'name');
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    med.ngoStock = ngoId;
    med.status = 'approved';
    await med.save();
    await med.populate('ngoStock', 'name'); // Populate after save to get NGO name

    // Send SMS notification to the donor
    if (med.donatedBy && med.donatedBy.mobile) {
      try {
        const ngoName = med.ngoStock ? med.ngoStock.name : 'the NGO';
        const pickupInfo = med.address && med.pickupDate && med.pickupTime ? ` Pickup details: Address - ${med.address}, Date - ${new Date(med.pickupDate).toLocaleDateString()}, Time - ${med.pickupTime}.` : '';
        await sendSMS(med.donatedBy.mobile, `Your donated medicine "${med.name}" has been accepted by ${ngoName} and is now in stock.${pickupInfo}`);
      } catch (smsErr) {
        console.error('SMS sending failed:', smsErr);
        // Do not fail assignment if SMS fails
      }
    }

    res.json({ message: 'Assigned to NGO', medicine: med });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { medicineId, status } = req.body;
    const med = await Medicine.findById(medicineId);
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    med.status = status;
    await med.save();
    res.json({ message: 'Status updated', medicine: med });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchMedicines = async (req, res) => {
  try {
    const { query } = req.query;
    const medicines = await Medicine.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { category: new RegExp(query, 'i') },
        { manufacturer: new RegExp(query, 'i') }
      ]
    }).populate('donatedBy', 'name').populate('ngoStock', 'name');
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.filterMedicines = async (req, res) => {
  try {
    const { category, status, expiryBefore } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (expiryBefore) filter.expiryDate = { $lt: new Date(expiryBefore) };
    const medicines = await Medicine.find(filter).populate('donatedBy', 'name').populate('ngoStock', 'name');
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.ocrProxy = async (req, res) => {
  // Proxy OCR request to external local OCR microservice defined in env OCR_SERVICE_URL
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const formData = new require('form-data')();
    const fs = require('fs');
    formData.append('image', fs.createReadStream(req.file.path));
    const ocrUrl = process.env.OCR_SERVICE_URL;
    if (!ocrUrl) return res.status(500).json({ message: 'OCR service URL not configured' });
    const resp = await axios.post(ocrUrl, formData, {
      headers: formData.getHeaders(),
      timeout: 20000
    });
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendExpiryNotifications = async (req, res) => {
  try {
    const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const expiringMedicines = await Medicine.find({
      expiryDate: { $lte: oneMonthFromNow, $gte: new Date() },
      status: { $ne: 'expired' } // Assuming status can be 'expired'
    }).populate('donatedBy', 'name mobile');

    let sentCount = 0;
    for (const med of expiringMedicines) {
      if (med.donatedBy && med.donatedBy.mobile) {
        try {
          await sendSMS(med.donatedBy.mobile, `Your donated medicine "${med.name}" is expiring soon on ${med.expiryDate.toDateString()}. Please check the status.`);
          sentCount++;
        } catch (smsErr) {
          console.error(`Failed to send expiry SMS to ${med.donatedBy.mobile}:`, smsErr);
        }
      }
    }
    res.json({ message: `Expiry notifications sent to ${sentCount} donors.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendBroadcastSMS = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const users = await User.find({ mobile: { $exists: true, $ne: null } });
    let sentCount = 0;
    for (const user of users) {
      try {
        await sendSMS(user.mobile, message);
        sentCount++;
      } catch (smsErr) {
        console.error(`Failed to send broadcast SMS to ${user.mobile}:`, smsErr);
      }
    }
    res.json({ message: `Broadcast SMS sent to ${sentCount} users.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
