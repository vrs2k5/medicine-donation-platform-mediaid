const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const ctrl = require('../controllers/reportController');

router.get('/', auth, permit('admin'), ctrl.getReports);
router.post('/generate/:month', auth, permit('admin'), ctrl.generateMonthlyReport);
router.get('/:month', auth, permit('admin'), ctrl.getReportByMonth);

module.exports = router;
