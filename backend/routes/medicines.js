const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ctrl = require('../controllers/medicineController');

router.post('/donate', auth, permit('member'), ctrl.createDonation);
router.get('/member', auth, permit('member'), ctrl.getMemberDonations);
router.get('/ngo/stock', auth, permit('ngo'), ctrl.getNGOStock);
router.get('/pending', auth, permit('ngo'), ctrl.getPendingDonations);
router.post('/assign', auth, permit('ngo','admin'), ctrl.assignToNGO);

// OCR proxy endpoint - uploads file and sends to OCR microservice
router.post('/ocr', upload.single('image'), auth, permit('member'), ctrl.ocrProxy);

// Send expiry notifications to donors
router.post('/send-expiry-notifications', auth, permit('admin'), ctrl.sendExpiryNotifications);

// Send broadcast SMS to all users
router.post('/broadcast-sms', auth, permit('admin'), ctrl.sendBroadcastSMS);

module.exports = router;
