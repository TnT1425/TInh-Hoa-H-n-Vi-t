import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert('📩 Mã OTP đã được gửi vào Email của bạn!');
      setStep(2);
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể gửi OTP'));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      alert('✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      navigate('/login');
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || 'Sai OTP hoặc OTP hết hạn'));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 border rounded-lg shadow-lg border-t-4 border-yellow-500">
      <h2 className="text-2xl font-bold text-center text-red-800 mb-6">Khôi Phục Mật Khẩu</h2>
      
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <p className="text-gray-600 text-sm text-center">Vui lòng nhập Email bạn đã đăng ký, chúng tôi sẽ gửi mã xác nhận cho bạn.</p>
          <input type="email" required placeholder="Nhập Email của bạn" className="w-full border p-3 rounded"
            onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700">
            Gửi Mã Xác Nhận
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-green-600 text-sm font-bold text-center">Mã OTP đã được gửi đến: {email}</p>
          <input type="text" required placeholder="Nhập mã OTP (6 số)" className="w-full border p-3 rounded text-center tracking-widest text-lg font-bold"
            onChange={(e) => setOtp(e.target.value)} />
          <input type="password" required placeholder="Nhập Mật Khẩu Mới" className="w-full border p-3 rounded"
            onChange={(e) => setNewPassword(e.target.value)} />
          <button type="submit" className="w-full bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800">
            Xác Nhận Đổi Mật Khẩu
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-gray-600">
        <Link to="/login" className="text-blue-600 hover:underline">Quay lại Đăng nhập</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;