const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const ctrl = require('../controllers/appointmentController');

router.post('/request', auth, permit('ngo'), ctrl.requestAppointment);
router.get('/ngo', auth, permit('ngo'), ctrl.getNGOAppointments);
router.get('/all', auth, permit('admin'), ctrl.getAllAppointments);
router.post('/approve', auth, permit('admin'), ctrl.approveAppointment);
router.post('/reject', auth, permit('admin'), ctrl.rejectAppointment);

module.exports = router;
