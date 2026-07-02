const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    if (user.blocked) return res.status(403).json({ message: 'User blocked' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token error', error: err.message });
  }
};

module.exports = auth;
