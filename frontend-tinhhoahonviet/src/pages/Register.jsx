import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('🎉 Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || 'Đăng ký thất bại'));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setProfile({ ...profile, phone: value }); 
    }
  };

  return (
    <div className="container mx-auto p-4 mt-10 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-red-700">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Đăng Ký Tài Khoản</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Họ và tên" required className="w-full border p-3 rounded bg-gray-50"
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email đăng nhập" required className="w-full border p-3 rounded bg-gray-50"
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Mật khẩu" required className="w-full border p-3 rounded bg-gray-50"
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <input type="tel" placeholder="Số điện thoại" required className="w-full border p-3 rounded bg-gray-50"
            onChange={handlePhoneChange} />
          <button className="w-full bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800 transition">
            Đăng Ký
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Đã có tài khoản? <Link to="/login" className="text-red-600 font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;