import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState("");

const filteredUsers = users.filter(user => 
  (user.username || user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      alert('Lỗi tải danh sách tài khoản');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    if (!window.confirm(`Bạn muốn đổi quyền người này thành ${newRole.toUpperCase()}?`)) return;
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/role`, 
        { role: newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Cập nhật quyền thành công!');
      fetchUsers(); // Tải lại bảng
    } catch (error) {
      alert('Lỗi khi cập nhật quyền');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Đã xóa tài khoản!');
      fetchUsers();
    } catch (error) {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-red-800 mb-6 border-b-2 border-yellow-500 pb-2">
        👥 Quản Lý Tài Khoản
      </h2>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="🔍 Tìm kiếm email, tên người dùng..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-red-800 text-yellow-400">
              <th className="p-4 border-b">Tên người dùng</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Quyền (Role)</th>
              <th className="p-4 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-orange-50 border-b">
                <td className="p-4 font-semibold">{user.username || user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'staff' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role ? user.role.toUpperCase() : 'CUSTOMER'}
                  </span>
                </td>
                <td className="p-4 text-center flex justify-center gap-2">
                  <select 
                    className="border p-1 rounded text-sm bg-gray-50 outline-none"
                    value={user.role || 'customer'}
                    onChange={(e) => handleChangeRole(user._id, e.target.value)}
                  >
                    <option value="customer">Khách hàng</option>
                    <option value="staff">Nhân viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                  <button 
                    onClick={() => handleDeleteUser(user._id)} 
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;