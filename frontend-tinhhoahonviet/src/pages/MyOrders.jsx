import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. KÉO HÀM FETCH RA ĐÂY ĐỂ AI CŨNG GỌI ĐƯỢC
  const fetchMyOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi tải lịch sử đơn hàng:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // 2. ĐƯA HÀM HỦY ĐƠN VÀO TRONG ĐỂ DÙNG CHUNG fetchMyOrders
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Hủy đơn thành công!");
      fetchMyOrders(); // Load lại giao diện mượt mà
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi hủy đơn");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': 
      case 'Chờ xác nhận': 
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">⏳ Chờ xác nhận</span>;
      case 'Shipping': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">🚚 Đang giao hàng</span>;
      case 'Delivered': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">✅ Đã nhận hàng</span>;
      case 'Đã hủy': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">❌ Đã hủy</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">{status}</span>;
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold">⏳ Đang tải dữ liệu...</div>;

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-800 pb-2">🛍️ Lịch Sử Mua Hàng Của Tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-500 text-lg mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link to="/" className="bg-red-700 text-white px-6 py-2 rounded font-bold hover:bg-red-800">Đi mua sắm ngay</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-800 text-white">
                <th className="p-3 border-b">Mã Đơn</th>
                <th className="p-3 border-b">Ngày Đặt</th>
                <th className="p-3 border-b">Sản Phẩm</th>
                <th className="p-3 border-b text-right">Tổng Tiền</th>
                <th className="p-3 border-b text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 border-b">
                  <td className="p-3 font-mono text-sm text-gray-500">{order._id.substring(0, 8)}</td>
                  <td className="p-3 text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="p-3 text-sm text-gray-700">
                    <ul className="list-disc pl-4">
                      {order.items?.map((item, idx) => (
                        <li key={idx}>{item.name} <span className="font-bold text-red-600">(x{item.qty})</span></li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 text-right font-bold text-red-700 text-lg">
                    {order.totalPrice?.toLocaleString()} đ
                  </td>
                  
                  {/* CỘT TRẠNG THÁI VÀ NÚT HỦY ĐƠN */}
                  <td className="p-3 text-center flex flex-col items-center gap-2">
                    {getStatusBadge(order.status)}
                    
                    {/* CHỈ HIỆN NÚT HỦY KHI ĐANG "CHỜ XÁC NHẬN" */}
                    {(order.status === 'Pending' || order.status === 'Chờ xác nhận') && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        className="bg-white border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition text-xs font-bold"
                      >
                        Hủy đơn
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;