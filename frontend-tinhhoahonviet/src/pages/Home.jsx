import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [region, setRegion] = useState(''); 
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Nhớ bật server Backend ở port 5000 nhé!
        const response = await axios.get(`http://localhost:5000/api/products?region=${region}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    fetchProducts();
  }, [region]); // Mỗi khi bạn bấm nút đổi miền, nó sẽ gọi lại API

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-4xl font-bold text-center text-red-800 mb-8 font-serif">Đặc Sản 3 Miền</h1>

      {/* Các nút Lọc Vùng Miền */}
      <div className="flex justify-center space-x-4 mb-10">
        <button onClick={() => setRegion('')} className="px-5 py-2 rounded-full font-semibold border bg-gray-100 hover:bg-gray-200">Tất cả</button>
        <button onClick={() => setRegion('North')} className="px-5 py-2 rounded-full font-semibold border bg-orange-100 text-orange-800 hover:bg-orange-200">Miền Bắc</button>
        <button onClick={() => setRegion('Central')} className="px-5 py-2 rounded-full font-semibold border bg-purple-100 text-purple-800 hover:bg-purple-200">Miền Trung</button>
        <button onClick={() => setRegion('South')} className="px-5 py-2 rounded-full font-semibold border bg-green-100 text-green-800 hover:bg-green-200">Miền Nam</button>
      </div>

      {/* Lưới hiển thị Sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg shadow-sm hover:shadow-xl transition p-4 bg-white flex flex-col">
            {/* Cục ảnh up từ Cloudinary sẽ hiện ở đây */}
            <img 
              src={product.image || 'https://via.placeholder.com/300x200?text=Chua+co+anh'} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h2>
            <p className="text-sm text-gray-500 mb-4 flex-grow italic">Kho: {product.stock} sản phẩm</p>
            <p className="text-red-600 font-bold text-lg mb-4">{product.price.toLocaleString()} VNĐ</p>
            <button 
  onClick={() => addToCart(product)} 
  className="w-full bg-red-700 text-white py-2 mt-4 rounded font-bold hover:bg-red-800 transition">
  Thêm vào giỏ
</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;