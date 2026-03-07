import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Lấy danh sách toàn bộ đơn hàng từ Backend
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/orders/admin/all', {
        headers: { 
          token: `Bearer ${token}`,
          Authorization: `Bearer ${token}` // Thêm dòng này cho giống Thunder Client
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
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { 
          token: `Bearer ${token}`,
          Authorization: `Bearer ${token}` // Thêm dòng này cho giống Thunder Client
        } }
      );
      alert(`Đã chuyển đơn hàng sang trạng thái: ${newStatus}`);
      fetchOrders(); // Tải lại bảng để cập nhật màu sắc
    } catch (error) {
      alert('❌ Lỗi cập nhật: ' + (error.response?.data?.message || 'Không thể đổi trạng thái'));
    }
  };

  // Hàm phụ trợ để tô màu Badge trạng thái cho đẹp
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">⏳ Chờ xử lý</span>;
      case 'Shipping': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">🚚 Đang giao</span>;
      case 'Delivered': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">✅ Đã giao xong</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">{status}</span>;
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold">⏳ Đang tải danh sách đơn hàng...</div>;

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-800 pb-2">📦 Quản Lý Đơn Giao Hàng</h1>

      {}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-red-800 text-white">
              <th className="p-3 border-b">Mã Đơn</th>
              <th className="p-3 border-b">Thông tin Khách</th>
              <th className="p-3 border-b">Chi tiết Món</th>
              <th className="p-3 border-b text-right">Tổng Tiền</th>
              <th className="p-3 border-b text-center">Trạng Thái</th>
              <th className="p-3 border-b text-center">Thao Tác (Đổi Trạng Thái)</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-6 text-gray-500 font-bold">Chưa có đơn hàng nào!</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 border-b">
                  <td className="p-3 font-mono text-xs text-gray-500">{order._id.substring(0, 8)}...</td>
                  <td className="p-3 text-sm">
                    {/* Cập nhật chuẩn theo DB của bạn: Thêm customerName, sửa thành address */}
                    <p className="font-bold text-blue-700 text-base">👤 {order.customerName || 'Khách vãng lai'}</p>
                    <p className="font-bold text-gray-800 mt-1">📞 {order.phone}</p>
                    <p className="text-gray-600 truncate w-48" title={order.address}>📍 {order.address}</p>
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    <ul className="list-disc pl-4">
                      {/* Cập nhật chuẩn theo DB của bạn: sửa orderItems thành items */}
                      {order.items?.map((item, idx) => (
                        <li key={idx}>
                          {item.product?.name || item.name || 'Sản phẩm'} <span className="font-bold text-red-600">(x{item.quantity || 1})</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 text-right font-bold text-red-700 text-lg">
                    {order.totalPrice?.toLocaleString()} đ
                  </td>
                  <td className="p-3 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex flex-col space-y-2 items-center">
                      {order.status === 'Pending' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Shipping')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded font-bold shadow">
                          Giao cho Shipper
                        </button>
                      )}
                      {order.status === 'Shipping' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded font-bold shadow">
                          Xác nhận Đã Giao
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <span className="text-gray-400 text-xs font-bold italic">Không thể đổi</span>
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