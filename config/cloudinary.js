const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Cấu hình chìa khóa kết nối với Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình kho lưu trữ (tạo thư mục trên mây)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tinhhoahonviet_products', // Tên thư mục nó sẽ tạo trên mây
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] // Chỉ cho phép up ảnh
  }
});

// 3. Tạo "Đường ống" multer để sử dụng
const uploadCloud = multer({ storage });

module.exports = uploadCloud;