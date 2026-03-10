import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user?.role || res.data.role || 'customer');
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setMessage('🎉 Đăng nhập thành công!');
      if (res.data.user.role === 'admin' || res.data.user.role === 'staff') {
        window.location.href = '/admin/orders'; // Nếu là Admin/Nhân viên -> Bay thẳng vào trang Quản trị
      } else {
        window.location.href = '/'; // Nếu là Khách -> Bay ra Trang chủ mua sắm
      }
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