const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { isValidNumber } = require('libphonenumber-js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { sendSMS } = require('../utils/smsService');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, role, mobile, location, area, securityQuestion, securityAnswer } = req.body;

  // Validate all required fields presence and non-empty
  if (!name || !email || !password || !role || !mobile || !location || !area || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ message: 'All fields (name, email, password, role, mobile, location, area, security question and answer) are required.' });
  }

  // Validate phone number: must start with +91 and have 10 digits after
  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(mobile)) {
    return res.status(400).json({ message: 'Phone number is invalid. It should start with +91 and have 10 digits.' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already used' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const securityAnswerHash = await bcrypt.hash(securityAnswer, salt);
    const fullLocation = `${location}, ${area}`;
    const user = new User({ name, email, passwordHash, role, mobile, location: fullLocation, securityQuestion, securityAnswerHash });
    await user.save();

    // Send SMS after successful registration
    try {
      await sendSMS(mobile, `Hello ${name}, thank you for registering at Medicine Donation Platform.`);
    } catch (smsErr) {
      console.error('SMS sending failed:', smsErr);
      // Do not fail registration if SMS fails
    }

    // Registration email sending removed to avoid missing credentials error

    res.json({ message: 'Registered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkSecurityQuestion = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    res.json({ securityQuestion: user.securityQuestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPasswordWithSecurityQuestion = async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;
  if (!email || !securityAnswer || !newPassword) {
    return res.status(400).json({ message: 'Email, security answer, and new password are required.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(securityAnswer, user.securityAnswerHash);
    if (!match) return res.status(400).json({ message: 'Security answer is incorrect' });

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    user.passwordHash = newPasswordHash;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    user.passwordHash = newPasswordHash;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
