const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const { verifyToken, verifyAdminOrStaff } = require('../middlewares/authMiddleware'); 

// 1. Khách hàng tạo đơn hàng
router.post('/', verifyToken, orderController.createOrder); 

// 2. Admin/Nhân viên xem toàn bộ đơn hàng
router.get('/admin/all', verifyToken, verifyAdminOrStaff, orderController.getAllOrders);

// 4. Khách hàng xem lịch sử đơn hàng của chính mình (API VỪA THÊM)
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.put('/:id/cancel', verifyToken, orderController.cancelOrder);

// 3. Admin/Nhân viên đổi trạng thái đơn hàng
router.put('/:id/status', verifyToken, verifyAdminOrStaff, orderController.updateOrderStatus);


module.exports = router;