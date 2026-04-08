
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, toggleSelection, toggleAllSelection } = useContext(CartContext);
  const navigate = useNavigate();

  // Lọc ra danh sách các món ĐANG ĐƯỢC TÍCH CHỌN
  const selectedItems = cart.filter(item => item.selected);
  
  // Chỉ tính tiền những món được chọn
  const totalPrice = selectedItems.reduce((total, item) => total + item.price * item.qty, 0);
  
  // Kiểm tra xem có phải tất cả đều đang được tích không
  const isAllSelected = cart.length > 0 && cart.every(item => item.selected);

  const handleCheckout = () => {
    // Chặn nếu khách chưa tích chọn món nào
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
      return;
    }

    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập tài khoản để tiến hành thanh toán nhé!');
      navigate('/login'); 
      return; 
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Giỏ hàng của bạn đang trống! 🛒</h2>
        <Link to="/" className="text-xl text-red-600 underline hover:text-red-800">Quay lại mua sắm Đặc Sản</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-800 pb-2">Giỏ Hàng Của Bạn</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4 bg-white p-6 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                {/* Ô Checkbox Chọn tất cả */}
                <th className="pb-3 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected} 
                    onChange={(e) => toggleAllSelection(e.target.checked)}
                    className="w-4 h-4 accent-red-700 cursor-pointer"
                  />
                </th>
                <th className="pb-3">Sản phẩm</th>
                <th className="pb-3">Đơn giá</th>
                <th className="pb-3 text-center">Số lượng</th>
                <th className="pb-3">Thành tiền</th>
                <th className="pb-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id} className={`border-b hover:bg-gray-50 transition-colors ${item.selected ? 'bg-red-50/30' : ''}`}>
                  {/* Ô Checkbox Chọn từng món */}
                  <td className="py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={!!item.selected} 
                      onChange={() => toggleSelection(item._id)}
                      className="w-4 h-4 accent-red-700 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 flex items-center gap-4">
                    <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <span className="font-bold text-gray-800">{item.name}</span>
                  </td>
                  <td className="py-4 text-red-600 font-semibold">{item.price.toLocaleString()} đ</td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center border rounded w-max mx-auto">
                      <button onClick={() => updateQuantity(item._id, item.qty - 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold">-</button>
                      <span className="px-4 font-semibold">{item.qty}</span>
                      <button onClick={() => updateQuantity(item._id, item.qty + 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold">+</button>
                    </div>
                  </td>
                  <td className="py-4 font-bold text-gray-800">{(item.price * item.qty).toLocaleString()} đ</td>
                  <td className="py-4">
                    <button onClick={() => removeFromCart(item._id)} className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-bold shadow">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:w-1/4 bg-white p-6 rounded-lg shadow h-fit border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
          <div className="flex justify-between mb-4 text-gray-600">
            <span>Đã chọn:</span>
            <span className="font-bold">{selectedItems.length} món</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600">
            <span>Tạm tính:</span>
            <span className="font-bold">{totalPrice.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between mb-6 text-gray-600">
            <span>Phí giao hàng:</span>
            <span className="font-bold">Miễn phí</span>
          </div>
          <div className="flex justify-between border-t pt-4 mb-6 text-xl">
            <span className="font-bold">Tổng cộng:</span>
            <span className="font-bold text-red-700">{totalPrice.toLocaleString()} đ</span>
          </div>
          <button 
              onClick={handleCheckout} 
              className={`w-full font-bold py-3 rounded-lg transition shadow-md ${selectedItems.length > 0 ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              💳 Tiến Hành Thanh Toán
            </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;