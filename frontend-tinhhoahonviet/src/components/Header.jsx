import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  // Kiểm tra xem khách đã đăng nhập chưa (bằng cách tìm token trong kho lưu trữ)
  const isLoggedIn = localStorage.getItem('token');

  // Hàm xử lý khi khách bấm Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xé bỏ thẻ căn cước
    alert('Đã đăng xuất thành công!');
    navigate('/'); // Đuổi về trang chủ
    window.location.reload(); // Tải lại trang để cập nhật thanh Menu
  };

  return (
    <header className="bg-red-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-serif text-yellow-500">
          🌾 Tinh Hoa Hồn Việt
        </Link>

        <nav className="flex space-x-6 items-center font-semibold">
          <Link to="/" className="hover:text-yellow-300 transition">Khám phá</Link>
          <Link to="/cart" className="flex items-center hover:text-yellow-300 transition relative">
            🛒 Giỏ hàng 
            <span className="ml-1 bg-yellow-500 text-red-900 px-2 py-0.5 rounded-full text-xs">
              {totalItems}
            </span>
          </Link>
          
          {/* LOGIC HIỂN THỊ NÚT ĐĂNG NHẬP / ĐĂNG XUẤT */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 border border-white rounded text-white hover:bg-white hover:text-red-900 transition">
              Đăng xuất
            </button>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 border border-yellow-500 rounded text-yellow-500 hover:bg-yellow-500 hover:text-red-900 transition">
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;