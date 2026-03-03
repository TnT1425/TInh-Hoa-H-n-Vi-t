// File: routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Nhập cái đường ống bốc vác ảnh vào đây
const uploadCloud = require('../config/cloudinary'); 

// Khách hàng lấy danh sách sản phẩm
router.get('/', productController.getProducts);    

// Admin thêm sản phẩm (Có gắn uploadCloud.single('image') để hứng file ảnh)
router.post('/', uploadCloud.single('image'), productController.createProduct); 

// Route Sửa và Xóa (Có thể kẹp thêm verifyAdminOrStaff sau nếu muốn bảo mật)
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;