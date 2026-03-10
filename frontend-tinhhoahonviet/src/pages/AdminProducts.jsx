import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = products.filter(product => 
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
);
  const [loading, setLoading] = useState(true);
  
  // Trạng thái bật/tắt Form Thêm/Sửa
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Dữ liệu của Form
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
    region: '',
    category: ''
  });

  // 1. GIAO DỊCH: Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm xử lý khi gõ vào các ô Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Bấm nút "Thêm Mới" -> Mở form trống
  const handleAddNew = () => {
    setFormData({ name: '', price: '', region: 'North', stock: '', description: '', image: '' });
    setEditingId(null);
    setShowForm(true);
  };

  // 3. Bấm nút "Sửa" -> Mở form có sẵn dữ liệu cũ
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      region: product.region || 'North',
      stock: product.stock,
      description: product.description || '',
      image: product.image || ''
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  // 4. GIAO DỊCH: Lưu dữ liệu (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Lấy thẻ Admin
    const config = { headers: { token: `Bearer ${token}`,Authorization: `Bearer ${token}` },Authorization: `Bearer ${token}` };

    try {
      if (editingId) {
        // Cập nhật (Sửa)
        await axios.put(`http://localhost:5000/api/products/${editingId}`, formData, config);
        alert('Đã cập nhật đặc sản thành công!');
      } else {
        // Thêm mới
        await axios.post('http://localhost:5000/api/products', formData, config);
        alert('Đã thêm đặc sản mới thành công!');
      }
      setShowForm(false);
      fetchProducts(); // Tải lại bảng
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể lưu sản phẩm'));
    }
  };

  // 5. GIAO DỊCH: Xóa sản phẩm
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${name}" không?`)) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { token: `Bearer ${token}`,Authorization: `Bearer ${token}` }
      });
      alert('Đã xóa thành công!');
      fetchProducts(); // Tải lại bảng
    } catch (error) {
      alert('❌ Lỗi khi xóa: ' + (error.response?.data?.message || 'Thử lại sau'));
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold">⏳ Đang tải kho hàng...</div>;

  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="flex justify-between items-center mb-6 border-b-2 border-red-800 pb-2">
        <h1 className="text-3xl font-bold text-red-800">🛠 Quản Lý Đặc Sản</h1>
        <button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow">
          + Thêm Đặc Sản Mới
        </button>
      </div>

      {showForm && (
        <div className="bg-orange-50 p-6 rounded-lg shadow-md mb-8 border border-orange-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'Sửa thông tin Đặc Sản' : 'Khai báo Đặc Sản mới'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Tên món ăn</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Giá bán (VNĐ)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Vùng Miền</label>
              <select name="region" value={formData.region} onChange={handleChange} className="w-full border p-2 rounded bg-white">
                <option value="North">Miền Bắc</option>
                <option value="Central">Miền Trung</option>
                <option value="South">Miền Nam</option>
              </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Danh mục sản phẩm</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-red-800"
                >
                  <option value="">-- Chọn danh mục --</option>
                  <option value="Bánh Kẹo">🍬 Bánh Kẹo</option>
                  <option value="Đồ Khô & Mứt">🌾 Đồ Khô & Mứt</option>
                  <option value="Trà & Cà Phê">☕ Trà & Cà Phê</option>
                  <option value="Nước Chấm">🧂 Nước Chấm (Gia vị)</option>
                  <option value="Quà Tặng">🎁 Quà Tặng</option>
                  <option value="Khác">📦 Khác</option>
                </select>
              </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Số lượng Tồn kho</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-1">Link Ảnh (URL)</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://link-anh-cua-ban.jpg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-1">Mô tả chi tiết</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border p-2 rounded"></textarea>
            </div>
            <div className="md:col-span-2 flex space-x-4 mt-2">
              <button type="submit" className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-6 rounded">
                💾 {editingId ? 'Lưu Thay Đổi' : 'Thêm Vào Kho'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="🔍 Tìm kiếm tên sản phẩm..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
        />
      </div>
      {/* BẢNG DANH SÁCH SẢN PHẨM */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-red-800 text-white">
              <th className="p-3 border-b">Hình Ảnh</th>
              <th className="p-3 border-b">Tên Đặc Sản</th>
              <th className="p-3 border-b text-center">Miền</th>
              <th className="p-3 border-b text-right">Giá Bán</th>
              <th className="p-3 border-b text-center">Tồn Kho</th>
              <th className="p-3 border-b text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 border-b">
                <td className="p-3">
                  <img src={product.image || 'https://placehold.co/80x80?text=No+Img'} alt={product.name} className="w-16 h-16 object-cover rounded shadow-sm" />
                </td>
                <td className="p-3 font-bold text-gray-800">{product.name}</td>
                <td className="p-3 text-center">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-semibold">
                    {product.region === 'North' ? 'Bắc' : product.region === 'Central' ? 'Trung' : 'Nam'}
                  </span>
                </td>
                <td className="p-3 text-right font-bold text-red-600">{product.price.toLocaleString()} đ</td>
                <td className="p-3 text-center font-bold text-gray-600">{product.stock}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => handleEdit(product)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-sm font-bold">Sửa</button>
                  <button onClick={() => handleDelete(product._id, product.name)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-sm font-bold">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;