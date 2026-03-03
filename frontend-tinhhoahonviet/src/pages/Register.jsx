import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API Đăng ký của Dev 1
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('🎉 ' + res.data.message + ' Bạn có thể đăng nhập ngay!');
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Lỗi đăng ký'));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-red-800 mb-6">Đăng Ký Tài Khoản</h2>
      {message && <p className="text-center mb-4 font-bold text-blue-600">{message}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input 
          type="text" placeholder="Họ và tên" required className="border p-2 rounded"
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="email" placeholder="Email" required className="border p-2 rounded"
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Mật khẩu" required className="border p-2 rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit" className="bg-red-700 text-white font-bold py-2 rounded hover:bg-red-800">
          Tạo tài khoản
        </button>
      </form>
    </div>
  );
};

export default Register;