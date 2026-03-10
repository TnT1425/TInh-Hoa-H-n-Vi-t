import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext'; 
import Register from './pages/Register';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers'; 
import AdminChat from './pages/AdminChat';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ChatBox from './components/ChatBox';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';

const CustomerLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col"> {/* Thêm flex flex-col */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex-1">
         <Outlet context={{ searchTerm }} />
      </div>
      <ChatBox />
      <Footer /> {/* 👉 THẢ CÁI FOOTER VÀO ĐÂY */}
    </div>
  );
};

const AdminLayout = () => {
  const userRole = localStorage.getItem('role') || 'customer';
  if (userRole !== 'admin' && userRole !== 'staff') {
    return <div className="p-10 text-center font-bold text-red-600 text-3xl mt-20">🚫 CẢNH BÁO: BẠN KHÔNG CÓ QUYỀN TRUY CẬP!</div>;
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <div className="w-64 bg-red-900 text-white flex flex-col shadow-2xl">
        <div className="p-5 text-2xl font-bold border-b border-red-800 text-yellow-400 flex items-center gap-2">
          ⚙️ QUẢN TRỊ
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {userRole === 'admin' && <Link to="/admin/dashboard" className="block p-3 rounded-lg hover:bg-red-800 transition font-semibold">📊 Thống Kê</Link>}
          <Link to="/admin/orders" className="block p-3 rounded-lg hover:bg-red-800 transition font-semibold">📦 QL Đơn Hàng</Link>
          <Link to="/admin/products" className="block p-3 rounded-lg hover:bg-red-800 transition font-semibold">🛠 QL Sản Phẩm</Link>
          {userRole === 'admin' && <Link to="/admin/users" className="block p-3 rounded-lg hover:bg-red-800 transition font-semibold">👥 QL Tài Khoản</Link>}
          <Link to="/admin/chat" className="block p-3 rounded-lg hover:bg-red-800 transition font-semibold">🎧 Trực Chat</Link>
        </nav>
        <div className="p-4 border-t border-red-800 bg-red-950">
          <Link to="/" className="block text-center mb-4 text-sm text-red-200 hover:text-white transition">← Về trang khách hàng</Link>
          <button onClick={handleLogout} className="w-full bg-white text-red-900 font-bold py-2.5 rounded-lg hover:bg-gray-200 shadow">Đăng xuất</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};


function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/chat" element={<AdminChat />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;