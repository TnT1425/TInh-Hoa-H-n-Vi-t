const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadCloud = require('../config/cloudinary'); 
const { verifyToken, verifyAdminOrStaff } = require('../middlewares/authMiddleware');

// CỰC KỲ QUAN TRỌNG: Route /search/all phải đặt TRƯỚC route /:id 
// Nếu đặt sau, Express sẽ tưởng chữ "search" là một cái ID sản phẩm và gây lỗi.
router.get('/search/all', productController.searchProducts); 

router.get('/', productController.getProducts); 
router.post('/', verifyToken, verifyAdminOrStaff, uploadCloud.single('image'), productController.createProduct); 
router.put('/:id', verifyToken, verifyAdminOrStaff, productController.updateProduct);
router.delete('/:id', verifyToken, verifyAdminOrStaff, productController.deleteProduct);
router.get('/:id', productController.getProductById);

module.exports = router;