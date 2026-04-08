
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { debounce } from "lodash";
import axios from 'axios'; 

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { cart } = useContext(CartContext);

  // --- STATE TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // Hiệu ứng loading

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert("Đã đăng xuất!");
    navigate('/login');
  };

  // --- THUẬT TOÁN DEBOUNCE TÌM KIẾM ---
  // useCallback giúp lưu hàm này vào bộ nhớ, không bị tạo lại mỗi khi giao diện render
  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      if (!query || query.trim().length < 1) {
        setSearchResults([]); // Xóa kết quả nếu gõ ít hơn 1 ký tự
        setIsSearching(false);
        return;
      }
      
      try {
        setIsSearching(true);
        // Lưu ý: Thay đổi URL baseURL nếu bạn setup axios instance riêng
        const response = await axios.get(`http://localhost:5000/api/products/search/all?q=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500), // Đợi 500ms (nửa giây) sau khi ngừng gõ mới gọi API
    []
  );

  // Lắng nghe sự thay đổi của searchTerm
  useEffect(() => {
    fetchSearchResults(searchTerm);
    // Cleanup function để hủy debounce nếu component bị unmount
    return () => fetchSearchResults.cancel();
  }, [searchTerm, fetchSearchResults]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl font-bold text-red-800 tracking-tight hover:text-red-700 transition">
            Tinh Hoa Hồn Việt
          </span>
        </Link>

        {/* --- KHU VỰC TÌM KIẾM DESKTOP --- */}
        <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
          <input 
            type="text" 
            placeholder="Bạn đang thèm đặc sản gì?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-100 shadow-inner bg-gray-50 text-sm transition-all"
          />
          
          {/* Dropdown hiển thị kết quả */}
          {searchTerm.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-gray-500">Đang tìm món ngon...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div 
                    key={product._id} 
                    onClick={() => {
                      navigate(`/product/${product._id}`); // Chuyển sang trang chi tiết
                      setSearchTerm(''); // Xóa thanh tìm kiếm sau khi click
                      setSearchResults([]);
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-red-50 cursor-pointer border-b border-gray-50 transition"
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{product.name}</h4>
                      <p className="text-red-600 text-xs font-bold">{product.price.toLocaleString('vi-VN')} đ</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">Opps! Không tìm thấy đặc sản này.</div>
              )}
            </div>
          )}
        </div>

        {/* --- MENU TÀI KHOẢN & GIỎ HÀNG --- */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/cart" className="relative group p-2 rounded-full hover:bg-gray-100">
            <span className="text-2xl group-hover:scale-110 block transition">🛒</span>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow">
              {cart?.reduce((total, item) => total + item.qty, 0) || 0}
            </span>
          </Link>
          
          {user ? (
            <div className="relative group ml-2 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2 text-sm font-bold text-red-800 bg-red-50 px-4 py-2 rounded-full cursor-pointer border border-red-100 hover:bg-red-100 transition">
                Chào, {user.username || user.name} <span className="text-[10px] text-red-500">▼</span>
              </div>
              <div className="absolute right-0 top-full pt-2 w-48 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <Link to="/profile" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700 transition">Hồ sơ cá nhân</Link>
                  <Link to="/my-orders" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700 transition">Đơn của tôi</Link>
                  <div className="border-t border-gray-100"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-800 transition">
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 pl-4 border-l border-gray-200 ml-2">
              <Link to="/login" className="bg-white text-red-800 px-4 py-2 rounded-full text-xs font-bold border border-red-800 hover:bg-red-50 transition">Đăng nhập</Link>
              <Link to="/register" className="bg-red-800 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-red-900 transition shadow">Đăng ký</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;