const Order = require('../models/Order');
const Product = require('../models/Product');

const orderController = {
  // Hàm 1: Đặt hàng
  createOrder: async (req, res) => {
    try {
      const { customerName, phone, address, items, paymentMethod } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Giỏ hàng trống' });
      }

      let calculatedTotal = 0;
      const orderItems = [];

      for (let item of items) {
        const productInDb = await Product.findById(item.product);
        
        if (!productInDb) {
          return res.status(404).json({ message: `Sản phẩm không tồn tại` });
        }
        if (productInDb.stock < item.qty) {
          return res.status(400).json({ message: `Sản phẩm ${productInDb.name} chỉ còn ${productInDb.stock} cái.` });
        }

        calculatedTotal += productInDb.price * item.qty;

        orderItems.push({
          product: productInDb._id,
          name: productInDb.name,
          qty: item.qty,
          price: productInDb.price 
        });
      }

      const order = new Order({
        user: req.user.id, // Lưu thêm ID của người mua (Lấy từ Token)
        customerName, phone, address, paymentMethod,
        items: orderItems,
        totalPrice: calculatedTotal
      });
      await order.save();

      for (let item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty } 
        });
      }

      res.status(201).json({ message: 'Đặt hàng thành công!', order });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi hệ thống khi đặt hàng', error });
    }
  },

  // Hàm 2: Lấy tất cả đơn hàng (Cho Admin)
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }); 
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi lấy danh sách', error });
    }
  },

  // Hàm 3: Cập nhật trạng thái (Cho Admin)
  updateOrderStatus: async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id, 
        { status: req.body.status },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi cập nhật', error });
    }
  },

  // Hàm 4: Khách tự xem lịch sử đơn hàng của mình (VỪA THÊM ĐỂ HẾT LỖI CRASH)
  getMyOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi lấy lịch sử đơn', error });
    }
  }
};

module.exports = orderController;