import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Lấy token từ bộ nhớ
      const token = localStorage.getItem('token');
      
      try {
        // 2. Gọi API kèm Token chuẩn như Thunder Client
        const res = await axios.get('http://localhost:5000/api/stats/dashboard', {
          headers: { 
            Authorization: `Bearer ${token}`,
            token: `Bearer ${token}` 
          }
        });
        setStats(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-2xl font-bold text-gray-600">⏳ Đang tải dữ liệu hệ thống...</div>;
  }

  if (!stats) {
    return <div className="text-center mt-20 text-red-600 font-bold">❌ Không thể kết nối tới máy chủ thống kê (Lỗi 404). Hãy kiểm tra lại Backend!</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-800 pb-2">📊 Bảng Điều Khiển Hệ Thống</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 font-semibold text-lg">Tổng Doanh Thu</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalRevenue?.toLocaleString()} VNĐ</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 font-semibold text-lg">Tổng Đơn Hàng</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalOrders} Đơn</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 font-semibold text-lg">Tổng Sản Phẩm</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.totalProducts} Món</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Top 5 Sản Phẩm Tồn Kho Thấp (Cần nhập thêm)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border">Tên Sản Phẩm</th>
                <th className="p-3 border text-center">Tồn Kho</th>
                <th className="p-3 border text-right">Đơn Giá</th>
                <th className="p-3 border text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {stats.topSellingProducts?.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border font-semibold text-red-800">{product.name}</td>
                  <td className="p-3 border text-center font-bold text-gray-700">{product.stock}</td>
                  <td className="p-3 border text-right">{product.price.toLocaleString()} đ</td>
                  <td className="p-3 border text-center">
                    {product.stock < 10 
                      ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">Sắp hết hàng</span>
                      : <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">Còn hàng</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;