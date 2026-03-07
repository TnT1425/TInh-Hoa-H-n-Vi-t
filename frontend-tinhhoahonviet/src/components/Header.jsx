import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';


const Header = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role') || 'customer';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('Đã đăng xuất thành công!');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-red-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-serif text-yellow-500">
          🌾 Tinh Hoa Hồn Việt
        </Link>

        <nav className="flex space-x-6 items-center font-semibold">
          <Link to="/" className="hover:text-yellow-300 transition">Khám phá</Link>

          {(!isLoggedIn || ['client', 'customer', 'staff'].includes(userRole)) && (
            <>
              <Link to="/cart" className="flex items-center hover:text-yellow-300 transition relative">
                🛒 Giỏ hàng 
                <span className="ml-1 bg-yellow-500 text-red-900 px-2 py-0.5 rounded-full text-xs">
                  {totalItems}
                </span>
              </Link>
              
              {isLoggedIn && userRole !== 'admin' && (
                <Link to="/my-orders" className="flex items-center hover:text-yellow-300 transition text-sm">
                  📝 Đơn của tôi
                </Link>
              )}
            </>
          )}

          {(userRole === 'staff' || userRole === 'admin') && (
            <Link to="/admin/orders" className="text-blue-200 hover:text-white transition">
              📦 QL Đơn Hàng
            </Link>
          )}

          {userRole === 'admin' && (
            <>
              <Link to="/admin/products" className="text-yellow-200 hover:text-white transition">
                🛠 QL Sản Phẩm
              </Link>
              <Link to="/admin/dashboard" className="text-yellow-200 hover:text-white transition">
                📊 Thống Kê
              </Link>
            </>
          )}
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="px-4 py-2 border border-yellow-500 rounded text-yellow-500 hover:bg-yellow-500 hover:text-red-900 transition">
              Hồ sơ cá nhân
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 border border-white rounded text-white hover:bg-white hover:text-red-900 transition text-sm">
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
            <Link to="/login" className="px-4 py-2 border border-yellow-500 rounded text-yellow-500 hover:bg-yellow-500 hover:text-red-900 transition">
              Đăng nhập
            </Link>
            <Link to="/register" className="px-4 py-2 border border-yellow-500 rounded text-yellow-500 hover:bg-yellow-500 hover:text-red-900 transition">
              Đăng ký
            </Link>
            </>
            
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;