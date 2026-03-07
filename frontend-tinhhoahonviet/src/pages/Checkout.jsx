import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({ fullName: '', phone: '', address: '' });
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}`, token: `Bearer ${token}` }
          });
          // Tự động nhét data vào form
          setShippingInfo({
            fullName: res.data.name || '',
            phone: res.data.phone || '',
            address: res.data.address || ''
          });
        } catch (error) {
          console.error('Không tải được thông tin cá nhân', error);
        }
      }
    };
    fetchUserProfile();
  }, []);

  const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Kiểm tra xem khách đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập tài khoản trước khi đặt hàng!');
      navigate('/login');
      return;
    }

    try {
      // ĐÓNG GÓI DỮ LIỆU CHUẨN 100% THEO BACKEND CỦA BẠN
      const orderData = {
        customerName: shippingInfo.fullName,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        paymentMethod: 'COD',
        items: cart.map(item => ({ 
          product: item._id, 
          qty: item.qty, 
          name: item.name 
        }))
      };

      // Gửi đơn hàng lên Backend
      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { token: `Bearer ${token}`,
        Authorization: `Bearer ${token}` }
      });

      alert('🎉 Đặt hàng thành công! Đơn hàng đã được chuyển cho Admin.');
      clearCart(); // Dọn sạch giỏ hàng
      navigate('/cart'); // Tạm quay về giỏ (hoặc trang chủ) để thấy giỏ đã trống
    } catch (error) {
      alert('❌ Lỗi đặt hàng: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
    }
  };

  // Chặn không cho thanh toán nếu giỏ trống
  if (cart.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Giỏ hàng đang trống!</h2>
        <Link to="/" className="text-red-600 underline text-lg font-semibold hover:text-red-800">Quay lại mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-800 pb-2">Thanh Toán Đơn Hàng</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* CỘT TRÁI: Form điền thông tin */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-700">Thông tin giao hàng</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-5" id="checkout-form">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Họ và tên người nhận</label>
              <input type="text" required className="w-full border p-3 rounded bg-gray-50 focus:bg-white" placeholder="VD: Nguyễn Văn A"
               value={shippingInfo.fullName} onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Số điện thoại liên hệ</label>
              <input type="tel" required className="w-full border p-3 rounded bg-gray-50 focus:bg-white" placeholder="VD: 0912345678"
                value={shippingInfo.phone} onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Địa chỉ giao hàng chi tiết</label>
              <textarea required className="w-full border p-3 rounded bg-gray-50 focus:bg-white h-24" placeholder="Số nhà, Tên đường, Phường/Xã..."
                value={shippingInfo.address} onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Phương thức thanh toán</label>
              <select className="w-full border p-3 rounded bg-gray-100 text-gray-700 cursor-not-allowed">
                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
              </select>
            </div>
          </form>
        </div>

        {/* CỘT PHẢI: Tóm tắt hóa đơn */}
        <div className="md:w-1/3 bg-orange-50 p-6 rounded-lg shadow-md h-fit border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold mb-4 text-red-800">Đơn hàng của bạn</h2>
          <div className="max-h-60 overflow-y-auto mb-4 border-b border-orange-200 pb-4 pr-2">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <div className="text-gray-700">
                  <span className="font-bold">{item.name}</span> <br/>
                  <span className="text-sm text-gray-500">Số lượng: <strong className="text-red-600">{item.qty}</strong></span>
                </div>
                <div className="font-bold text-gray-800">
                  {(item.price * item.qty).toLocaleString()} đ
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-lg font-bold mt-4 pt-2">
            <span className="text-gray-700">Tổng thanh toán:</span>
            <span className="text-red-700 text-2xl">{totalPrice.toLocaleString()} VNĐ</span>
          </div>

          <button type="submit" form="checkout-form" className="w-full bg-red-700 text-white font-bold py-4 mt-6 rounded-lg hover:bg-red-800 transition shadow-lg text-lg uppercase">
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;