import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Dùng để chuyển trang sau khi đăng nhập thành công

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API Đăng nhập
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Lưu lại thẻ căn cước (Token) vào bộ nhớ trình duyệt
      localStorage.setItem('token', res.data.token);

      const userRole = res.data.role || res.data.user?.role || 'client';
      localStorage.setItem('role', userRole);
      
      setMessage('🎉 Đăng nhập thành công!');
      
      // Đợi 1.5 giây rồi tự động đẩy khách về Trang chủ
      setTimeout(() => {
        window.location.href = '/'; 
      }, 1500);
    
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Sai email hoặc mật khẩu'));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 border rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-red-800 mb-6 border-b pb-2">Đăng Nhập</h2>
      
      {message && <p className="text-center mb-4 font-bold text-blue-600">{message}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        <input 
          type="email" placeholder="Email của bạn" required 
          className="border border-gray-300 p-3 rounded focus:outline-none focus:border-red-500"
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Mật khẩu" required 
          className="border border-gray-300 p-3 rounded focus:outline-none focus:border-red-500"
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline self-end">
          Quên mật khẩu?
        </Link>
        <button type="submit" className="bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800 transition text-lg">
          Vào Cửa Hàng
        </button>
      </form>

      <div className="mt-6 text-center text-gray-600">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-red-600 font-bold hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default Login;