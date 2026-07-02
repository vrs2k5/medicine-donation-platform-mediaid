const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('securityQuestion').notEmpty().withMessage('Security question is required'),
  body('securityAnswer').notEmpty().withMessage('Security answer is required')
], ctrl.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], ctrl.login);

router.post('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], ctrl.changePassword);

router.post('/reset-password-security-question', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('securityAnswer').notEmpty().withMessage('Security answer is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], ctrl.resetPasswordWithSecurityQuestion);

router.post('/check-security-question', [
  body('email').isEmail().withMessage('Valid email is required')
], ctrl.checkSecurityQuestion);

module.exports = router;
