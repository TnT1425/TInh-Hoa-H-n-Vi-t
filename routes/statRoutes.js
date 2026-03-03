const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');
const { verifyToken, verifyAdminOrStaff } = require('../middlewares/authMiddleware');

// Route này chỉ Admin hoặc Staff mới được vào xem
router.get('/dashboard', verifyToken, verifyAdminOrStaff, statController.getDashboardStats);

module.exports = router;