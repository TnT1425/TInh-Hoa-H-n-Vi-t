import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  
  // STATE MỚI: Quản lý dữ liệu form đổi mật khẩu
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}`, token: `Bearer ${token}` }
        });
        setProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Lỗi lấy thông tin', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/auth/profile', profile, {
        headers: { Authorization: `Bearer ${token}`, token: `Bearer ${token}` }
      });
      alert('✅ Cập nhật thông tin cá nhân thành công!');
    } catch (error) {
      alert('❌ Lỗi khi cập nhật thông tin');
    }
  };

  // HÀM MỚI: Xử lý khi khách bấm nút Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert('❌ Mật khẩu mới và Xác nhận mật khẩu không khớp!');
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/auth/change-password', 
        { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }, 
        { headers: { Authorization: `Bearer ${token}`, token: `Bearer ${token}` } }
      );
      alert('🔒 Đổi mật khẩu thành công!');
      // Xóa trắng form mật khẩu sau khi đổi xong
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể đổi mật khẩu'));
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold">⏳ Đang tải thông tin...</div>;
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setProfile({ ...profile, phone: value }); 
    }
  };

  return (
    <div className="container mx-auto p-4 mt-8 max-w-4xl flex flex-col md:flex-row gap-8">
      
      {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
      <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md border-t-4 border-yellow-500 h-fit">
        <h1 className="text-2xl font-bold text-red-800 mb-6 border-b pb-2">👤 Thông Tin Cá Nhân</h1>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Email (Không thể thay đổi)</label>
            <input type="email" value={profile.email} disabled className="w-full border p-3 rounded bg-gray-200 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Họ và tên</label>
            <input type="text" value={profile.name} required className="w-full border p-3 rounded bg-gray-50 focus:bg-white" 
              onChange={(e) => setProfile({...profile, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Số điện thoại</label>
            <input type="tel" value={profile.phone} required className="w-full border p-3 rounded bg-gray-50 focus:bg-white" 
              onChange={handlePhoneChange} />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Địa chỉ mặc định</label>
            <textarea value={profile.address} required className="w-full border p-3 rounded bg-gray-50 focus:bg-white h-24" 
              onChange={(e) => setProfile({...profile, address: e.target.value})}></textarea>
          </div>
          <button type="submit" className="w-full bg-red-700 text-white font-bold py-3 mt-4 rounded hover:bg-red-800 transition shadow-lg">
            💾 Lưu Thông Tin
          </button>
        </form>
      </div>

      {/* CỘT PHẢI: ĐỔI MẬT KHẨU */}
      <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md border-t-4 border-gray-400 h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">🔒 Đổi Mật Khẩu</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Mật khẩu hiện tại</label>
            <input type="password" required className="w-full border p-3 rounded bg-gray-50 focus:bg-white" placeholder="Nhập mật khẩu cũ"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Mật khẩu mới</label>
            <input type="password" required minLength="6" className="w-full border p-3 rounded bg-gray-50 focus:bg-white" placeholder="Ít nhất 6 ký tự"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Xác nhận mật khẩu mới</label>
            <input type="password" required minLength="6" className="w-full border p-3 rounded bg-gray-50 focus:bg-white" placeholder="Nhập lại mật khẩu mới"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3 mt-4 rounded hover:bg-black transition shadow-lg">
            Khóa Mật Khẩu Mới
          </button>
        </form>
      </div>

    </div>
  );
};

export default Profile;