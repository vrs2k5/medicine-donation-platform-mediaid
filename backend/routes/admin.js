const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const ctrl = require('../controllers/adminController');

router.get('/users', auth, permit('admin'), ctrl.getUsers);
router.post('/block', auth, permit('admin'), ctrl.blockUser);
router.post('/delete-medicine', auth, permit('admin'), ctrl.deleteMedicine);
router.get('/report/monthly', auth, permit('admin'), ctrl.monthlyReport);

module.exports = router;
