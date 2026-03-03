const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Đếm tổng số lượng
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // 2. Tính tổng doanh thu (Chỉ tính những đơn hàng có trạng thái 'Delivered' - Đã giao)
    const deliveredOrders = await Order.find({ status: 'Delivered' });
    let totalRevenue = 0;
    
    // Vòng lặp cộng dồn tiền của các đơn đã giao
    deliveredOrders.forEach(order => {
      totalRevenue += order.totalPrice;
    });

    // Lấy 5 sản phẩm bán chạy nhất (tồn kho thấp nhất)
    const topSellingProducts = await Product.find().sort({ stock: 1 }).limit(5).select('name stock price');

    // 3. Trả về 1 cục JSON cho Frontend vẽ biểu đồ
    res.status(200).json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      topSellingProducts, 
      message: 'Lấy dữ liệu thống kê thành công'
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thống kê', error });
  }
};