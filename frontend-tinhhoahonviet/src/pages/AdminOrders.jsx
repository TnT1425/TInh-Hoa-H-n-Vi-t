import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.phone || "").includes(searchTerm)
  );

  // 1. Lấy danh sách toàn bộ đơn hàng từ Backend
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/orders/admin/all', {
        headers: { 
          token: `Bearer ${token}`,
          Authorization: `Bearer ${token}` 
        }
      });
      // Sắp xếp đơn hàng mới nhất lên đầu
      const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. GIAO DỊCH: Hàm cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId, newStatus) => {
    // Xác nhận trước khi cập nhật
    if (!window.confirm(`Bạn có chắc muốn chuyển đơn hàng này sang trạng thái: ${newStatus}?`)) return;

    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { 
          token: `Bearer ${token}`,
          Authorization: `Bearer ${token}` 
        } }
      );
      fetchOrders(); // Tải lại bảng để cập nhật màu sắc
    } catch (error) {
      alert('❌ Lỗi cập nhật: ' + (error.response?.data?.message || 'Không thể đổi trạng thái'));
    }
  };

  // Hàm phụ trợ để tô màu Badge trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 shadow-sm">⏳ Chờ xác nhận</span>;
      case 'Processing': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 shadow-sm">⚙️ Đang chuẩn bị hàng</span>;
      case 'Shipping': return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold border border-purple-200 shadow-sm">🚚 Đang giao hàng</span>;
      case 'Delivered': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200 shadow-sm">✅ Đã nhận hàng</span>;
      case 'Đã hủy': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200 shadow-sm">❌ Đã hủy</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold text-red-800">⏳ Đang tải danh sách đơn hàng...</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-800 pb-2 inline-block">📦 Quản Lý Đơn Giao Hàng</h1>

      <div className="mb-6 print:hidden">
        <div className="relative w-full md:w-1/2">
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Tìm theo mã đơn, tên hoặc SĐT..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto border border-gray-100">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-red-800 text-white text-sm">
              <th className="p-4 border-b font-semibold">Mã Đơn</th>
              <th className="p-4 border-b font-semibold">Thông tin Khách</th>
              <th className="p-4 border-b font-semibold">Chi tiết Món</th>
              <th className="p-4 border-b font-semibold text-right">Tổng Tiền</th>
              <th className="p-4 border-b font-semibold text-center">Trạng Thái</th>
              <th className="p-4 border-b font-semibold text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-10 text-gray-500 font-bold text-lg">Chưa có đơn hàng nào!</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-red-50 transition-colors border-b border-gray-100">
                  <td className="p-4 font-mono text-xs text-gray-500 font-bold">#{order._id.substring(0, 8).toUpperCase()}</td>
                  
                  <td className="p-4 text-sm">
                    <p className="font-bold text-blue-700 text-base mb-1">👤 {order.customerName || 'Khách vãng lai'}</p>
                    <p className="font-bold text-gray-800">📞 {order.phone}</p>
                    <p className="text-gray-600 truncate w-48 mt-1 text-xs" title={order.address}>📍 {order.address}</p>
                  </td>
                  
                  <td className="p-4 text-sm text-gray-700">
                    <ul className="list-disc pl-4 space-y-1">
                      {order.items?.map((item, idx) => (
                        <li key={idx}>
                          {item.product?.name || item.name || 'Sản phẩm'} 
                          <span className="font-bold text-red-600 ml-1">(x{item.quantity || item.qty || 1})</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  
                  <td className="p-4 text-right">
                    <p className="font-bold text-red-700 text-lg">{order.totalPrice?.toLocaleString()} đ</p>
                    {/* 👉 HIỂN THỊ PHƯƠNG THỨC THANH TOÁN Ở ĐÂY */}
                    {order.paymentMethod === 'Banking' ? (
                      <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-[10px] font-bold border border-blue-200">🏦 CHUYỂN KHOẢN</span>
                    ) : (
                      <span className="inline-block mt-2 bg-orange-100 text-orange-800 px-2 py-1 rounded text-[10px] font-bold border border-orange-200">💵 TIỀN MẶT (COD)</span>
                    )}
                  </td>
                  
                  <td className="p-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className="flex flex-col space-y-2 items-center">
                      {order.status === 'Pending' && order.paymentMethod === 'Banking' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Processing')} className="w-full bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded font-bold shadow transition">
                          Đã Thu Tiền (Duyệt)
                        </button>
                      )}
                      {order.status === 'Pending' && order.paymentMethod !== 'Banking' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Processing')} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded font-bold shadow transition">
                          Chốt Đơn
                        </button>
                      )}
                      {order.status === 'Processing' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Shipping')} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-2 rounded font-bold shadow transition">
                          Giao cho Shipper
                        </button>
                      )}
                      {order.status === 'Shipping' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="w-full bg-gray-800 hover:bg-black text-white text-xs px-3 py-2 rounded font-bold shadow transition">
                          Xác nhận Đã Giao
                        </button>
                      )}
                      {(order.status === 'Delivered' || order.status === 'Đã hủy') && (
                        <span className="text-gray-400 text-xs font-bold italic border border-gray-200 px-3 py-1 rounded bg-gray-50">Đã chốt sổ</span>
                      )}

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;