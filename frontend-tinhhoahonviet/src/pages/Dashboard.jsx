import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const AdminDashboard = () => {
  // TẠM THỜI DÙNG DỮ LIỆU MẪU ĐỂ LÊN HÌNH GIAO DIỆN TRƯỚC
  // (Sau này bạn sẽ gọi API từ axios.get('/api/stats') để thay thế các state này)
  const [stats, setStats] = useState({
    totalRevenue: 12500000,
    totalOrders: 145,
    totalProducts: 42,
    totalUsers: 89
  });

  const revenueData = [
    { name: 'T2', DoanhThu: 1200000 },
    { name: 'T3', DoanhThu: 2100000 },
    { name: 'T4', DoanhThu: 800000 },
    { name: 'T5', DoanhThu: 1600000 },
    { name: 'T6', DoanhThu: 2400000 },
    { name: 'T7', DoanhThu: 3200000 },
    { name: 'CN', DoanhThu: 2800000 },
  ];

  const orderStatusData = [
    { name: 'Chờ xác nhận', value: 15 },
    { name: 'Đang giao', value: 45 },
    { name: 'Đã nhận', value: 80 },
    { name: 'Đã hủy', value: 5 },
  ];

  const topProductsData = [
    { name: 'Bánh Pía', DaBan: 120 },
    { name: 'Nem Chua', DaBan: 98 },
    { name: 'Trà Thái Nguyên', DaBan: 86 },
    { name: 'Mực Rim Me', DaBan: 65 },
    { name: 'Bánh Cốm', DaBan: 45 },
  ];

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444']; // Màu cho biểu đồ tròn

  return (
    <div className="p-2 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-800 pb-2 inline-block">
        📊 TỔNG QUAN HỆ THỐNG
      </h1>

      {/* 1. ROW: CÁC THẺ SỐ LIỆU NHANH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition">
          <p className="text-gray-500 font-bold mb-1">TỔNG DOANH THU</p>
          <h3 className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()}đ</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
          <p className="text-gray-500 font-bold mb-1">TỔNG ĐƠN HÀNG</p>
          <h3 className="text-3xl font-bold text-blue-600">{stats.totalOrders} <span className="text-sm font-normal text-gray-400">đơn</span></h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-500 hover:shadow-md transition">
          <p className="text-gray-500 font-bold mb-1">SẢN PHẨM TRONG KHO</p>
          <h3 className="text-3xl font-bold text-orange-600">{stats.totalProducts} <span className="text-sm font-normal text-gray-400">món</span></h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition">
          <p className="text-gray-500 font-bold mb-1">KHÁCH HÀNG</p>
          <h3 className="text-3xl font-bold text-purple-600">{stats.totalUsers} <span className="text-sm font-normal text-gray-400">người</span></h3>
        </div>
      </div>

      {/* 2. ROW: BIỂU ĐỒ DOANH THU & TRẠNG THÁI ĐƠN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Biểu đồ Doanh thu (Chiếm 2/3 không gian) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">📈 Doanh thu 7 ngày gần nhất</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="DoanhThu" stroke="#dc2626" strokeWidth={3} activeDot={{ r: 8 }} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" tick={{fill: '#6b7280'}} />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} tick={{fill: '#6b7280'}} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ Trạng thái đơn hàng (Chiếm 1/3 không gian) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-2">📦 Tỉ lệ trạng thái đơn</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. ROW: BIỂU ĐỒ SẢN PHẨM BÁN CHẠY NHẤT */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <h2 className="text-lg font-bold text-gray-800 mb-6">🔥 Top 5 Sản phẩm bán chạy nhất</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProductsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12, fill: '#374151', fontWeight: 600}} />
              <Tooltip cursor={{fill: '#fef2f2'}} />
              <Legend />
              <Bar dataKey="DaBan" fill="#b91c1c" radius={[0, 4, 4, 0]} barSize={30} name="Số lượng đã bán" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;