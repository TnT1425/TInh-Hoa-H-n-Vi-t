import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const handleAddToCart = (product) => {
      const isLoggedIn = localStorage.getItem('token');
      if (!isLoggedIn) {
        alert('Vui lòng đăng nhập tài khoản để thêm món này vào giỏ hàng nhé!');
        navigate('/login'); 
        return;
      }
      addToCart({ ...product, qty: 1 });
      alert(`🛒 Đã thêm ${product.name} vào giỏ hàng!`);
    };

  if (loading) return <div className="text-center mt-20 text-2xl font-bold">⏳ Đang tải thông tin...</div>;
  if (!product) return <div className="text-center mt-20 text-2xl text-red-600 font-bold">❌ Sản phẩm không tồn tại!</div>;

  const getRegionName = (regionCode) => {
    switch (regionCode) {
      case 'North': return 'Miền Bắc';
      case 'Central': return 'Miền Trung';
      case 'South': return 'Miền Nam';
      default: return 'Việt Nam'; 
    }
  };

  return (
    <div className="container mx-auto p-6 mt-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="text-red-800 font-bold hover:underline mb-6">
        &larr; Quay lại
      </button>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
          <img 
            src={product.image || product.imageUrl} 
            alt={product.name} 
            className="w-full h-auto object-cover rounded shadow-lg max-h-[400px]"
          />
        </div>

        {/* CỘT PHẢI: THÔNG TIN VÀ CHỐT ĐƠN */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Đặc sản {getRegionName(product.region)}
            </span>
            <h1 className="text-4xl font-bold text-red-800 mt-4 mb-2">{product.name}</h1>
            
            <p className="text-3xl font-bold text-red-600 mb-6 border-b pb-4">
              {product.price?.toLocaleString()} ₫
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Chi tiết sản phẩm:</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || 'Chưa có mô tả cho sản phẩm này.'}
              </p>
            </div>
            
            <p className="text-sm text-gray-500 mb-6 font-semibold">
              Kho hàng: {product.stock > 0 ? <span className="text-green-600">Còn {product.stock} sản phẩm</span> : <span className="text-red-600">Hết hàng</span>}
            </p>
          </div>

          {/* CHỌN SỐ LƯỢNG VÀ NÚT MUA */}
          {product.stock > 0 ? (
            <div className="flex items-center gap-4 mt-auto">
              {/* Nút Tăng giảm số lượng */}
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button 
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition"
                >-</button>
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  className="w-16 text-center py-2 font-bold outline-none"
                  min="1" max={product.stock}
                />
                <button 
                  onClick={() => setQty(qty < product.stock ? qty + 1 : product.stock)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition"
                >+</button>
              </div>

              {/* Nút Thêm vào giỏ */}
              <button 
                onClick={() => handleAddToCart({ ...product, qty: 1 })}
                className="flex-1 bg-red-800 text-white py-3 rounded hover:bg-red-900 font-bold text-lg shadow-lg transition transform hover:-translate-y-1"
              >
                 THÊM VÀO GIỎ
              </button>
            </div>
          ) : (
            <button disabled className="w-full bg-gray-400 text-white py-3 rounded font-bold text-lg mt-auto cursor-not-allowed">
              ĐÃ HẾT HÀNG
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;