const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, items, paymentMethod } = req.body;

    // 1. Kiểm tra giỏ hàng có rỗng không
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    // 2. Loop qua từng món trong giỏ để check tồn kho và tính tiền
    for (let item of items) {
      const productInDb = await Product.findById(item.product);
      
      if (!productInDb) {
        return res.status(404).json({ message: `Sản phẩm ${item.name} không tồn tại` });
      }
      
      if (productInDb.stock < item.qty) {
        return res.status(400).json({ message: `Sản phẩm ${productInDb.name} chỉ còn ${productInDb.stock} cái.` });
      }

      // Cộng tiền: Giá trong DB * Số lượng FE gửi
      calculatedTotal += productInDb.price * item.qty;

      // Đưa vào mảng đơn hàng
      orderItems.push({
        product: productInDb._id,
        name: productInDb.name,
        qty: item.qty,
        price: productInDb.price // Lưu cứng giá lúc mua
      });
    }

    // 3. Tạo đơn hàng mới
    const order = new Order({
      customerName, phone, address, paymentMethod,
      items: orderItems,
      totalPrice: calculatedTotal
    });
    await order.save();

    // 4. Trừ đi số lượng tồn kho trong bảng Product
    for (let item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty } // Trừ đi số lượng đã mua
      });
    }

    res.status(201).json({ message: 'Đặt hàng thành công!', order });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống khi đặt hàng', error });
  }
};

// Lấy danh sách đơn hàng (Cho Admin/Nhân viên)
exports.getOrders = async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu
    res.status(200).json(orders);
};

// Cập nhật trạng thái đơn hàng (Dành cho Dev 3 ấn nút Giao hàng)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, // Truyền { status: "Shipping" }
            { new: true }
        );
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật', error });
    }
}
// [DÀNH CHO ADMIN/STAFF] Lấy toàn bộ danh sách đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    // .populate() giống như JOIN trong SQL, giúp lấy thêm email của user từ bảng User
    // .sort({ createdAt: -1 }) để đơn hàng mới nhất nổi lên đầu
    const orders = await Order.find()
                              .populate('user', 'name email')
                              .sort({ createdAt: -1 }); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng', error });
  }
};

// [DÀNH CHO ADMIN/STAFF] Cập nhật trạng thái đơn hàng (Ví dụ: Pending -> Shipping)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Tìm đơn hàng theo ID truyền trên thanh URL và cập nhật status mới
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: status },
      { new: true } // Trả về data mới sau khi cập nhật
    );

    if (!updatedOrder) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    res.status(200).json({ message: 'Cập nhật trạng thái thành công', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật', error });
  }
};
// [DÀNH CHO KHÁCH HÀNG] Xem lịch sử đơn hàng của chính mình
exports.getMyOrders = async (req, res) => {
  try {
    // Tìm các đơn hàng có trường 'user' khớp với ID của người đang đăng nhập (lấy từ Token)
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử đơn hàng', error });
  }
};