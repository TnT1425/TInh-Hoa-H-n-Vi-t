// File: routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { verifyToken, verifyAdminOrStaff } = require('../middlewares/authMiddleware');

// 1. Lấy danh sách TẤT CẢ tài khoản (Chỉ Admin/Staff mới được xem)
router.get('/', verifyToken, verifyAdminOrStaff, async (req, res) => {
  try {
    // .select('-password') để giấu mật khẩu, không gửi về Frontend
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi tải danh sách người dùng' });
  }
});

// 2. đổi quyền
router.put('/:id/role', verifyToken, verifyAdminOrStaff, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { role: req.body.role }, 
      { new: true }
    ).select('-password');
    res.json({ message: 'Đã cập nhật quyền thành công!', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật quyền' });
  }
});

// 3. Xóa tài khoản 
router.delete('/:id', verifyToken, verifyAdminOrStaff, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa tài khoản thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa tài khoản' });
  }
});

module.exports = router;