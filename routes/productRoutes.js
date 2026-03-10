const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadCloud = require('../config/cloudinary'); 
const { verifyToken, verifyAdminOrStaff } = require('../middlewares/authMiddleware');

router.get('/', productController.getProducts); 
router.post('/', verifyToken, verifyAdminOrStaff, uploadCloud.single('image'), productController.createProduct); 
router.put('/:id', verifyToken, verifyAdminOrStaff, productController.updateProduct);
router.delete('/:id', verifyToken, verifyAdminOrStaff, productController.deleteProduct);
router.get('/:id', productController.getProductById);

module.exports = router;