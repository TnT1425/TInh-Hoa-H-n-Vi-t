const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Đọc data JSON FE gửi lên

// Kết nối Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB thành công!'))
  .catch((err) => console.log('❌ Lỗi kết nối DB: ', err));

// Test API đầu tiên
app.get('/', (req, res) => {
  res.send('API Tinh Hoa Hồn Việt đang chạy...');
});

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Kết nối Route Người dùng (Auth)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Kết nối Route Đơn hàng
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Kết nối Route Thống kê
const statRoutes = require('./routes/statRoutes');
app.use('/api/stats', statRoutes);

// Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại port ${PORT}`));