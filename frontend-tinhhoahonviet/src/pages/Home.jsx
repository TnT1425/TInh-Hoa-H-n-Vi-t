import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

// ==========================================
// COMPONENT PHỤ: BĂNG CHUYỀN SCROLL NGANG (Carousel)
// ==========================================
const HorizontalCarousel = ({ title, products, handleAddToCart, onViewAll }) => {
  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    scrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mb-8 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Tiêu đề & Nút Xem Tất Cả / Điều hướng */}
      <div className="flex justify-between items-end mb-5 pb-2 border-b border-orange-100">
        <h2 className="text-xl md:text-2xl font-bold text-red-800 uppercase pl-3 border-l-4 border-yellow-500">
          {title}
        </h2>
        
        <div className="flex items-center gap-4">
          {/* Nút Xem tất cả cho từng loại */}
          {onViewAll && (
            <button 
              onClick={onViewAll} 
              className="text-sm font-bold text-red-600 hover:text-red-800 hover:underline transition"
            >
              Xem tất cả &gt;
            </button>
          )}
          
          <div className="flex gap-2 hidden lg:flex">
            <button onClick={() => scroll(-300)} className="w-8 h-8 rounded-full bg-white shadow hover:bg-red-100 flex items-center justify-center text-red-800 border transition">
              &#8592;
            </button>
            <button onClick={() => scroll(300)} className="w-8 h-8 rounded-full bg-white shadow hover:bg-red-100 flex items-center justify-center text-red-800 border transition">
              &#8594;
            </button>
          </div>
        </div>
      </div>

      {/* Vùng cuộn ngang (Thu nhỏ width một chút để vừa cột phải) */}
      <div 
        ref={scrollRef} 
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product._id} className="min-w-[180px] md:min-w-[200px] max-w-[220px] flex-shrink-0 snap-start border border-gray-200 rounded-xl hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col group overflow-hidden">
            
            <Link to={`/product/${product._id}`} className="relative overflow-hidden block h-36 bg-gray-50">
              <img 
                src={product.image || 'https://via.placeholder.com/300x300?text=Chưa+có+ảnh'} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {title.includes('Nổi Bật') && (
                <span className="absolute top-2 left-2 bg-red-600 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded shadow-md">HOT</span>
              )}
            </Link>

            <div className="p-3 flex flex-col flex-1">
              <Link to={`/product/${product._id}`}>
                <h2 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-red-700 transition-colors" title={product.name}>
                  {product.name}
                </h2>
              </Link>
              
              <div className="flex-1"></div>

              <div className="flex justify-between items-end mt-2 mb-3">
                <p className="text-red-600 font-bold text-lg">
                  {product.price.toLocaleString()}đ
                </p>
                <p className="text-[10px] text-gray-500 font-medium">Bán {product.sold || 0}</p>
              </div>
              
              <button 
                onClick={() => handleAddToCart(product)} 
                disabled={product.stock <= 0}
                className={`w-full py-2 rounded-lg font-bold text-xs transition-all shadow-sm ${
                  product.stock > 0 
                    ? 'bg-red-700 text-white hover:bg-red-800' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                }`}
              >
                {product.stock > 0 ? 'MUA NGAY' : 'TẠM HẾT'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT CHÍNH: TRANG CHỦ
// ==========================================
const Home = () => {
  const context = useOutletContext();
  const searchTerm = context?.searchTerm || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  
  // 👉 QUẢN LÝ SỐ LƯỢNG HIỂN THỊ CỦA LƯỚI SẢN PHẨM CHÍNH (Mặc định 8)
  const [visibleCount, setVisibleCount] = useState(8);
  
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const categories = [
    { name: "Tất cả", value: "All" }, 
    { name: "Miền Bắc", value: "North" }, 
    { name: "Miền Trung", value: "Central" }, 
    { name: "Miền Nam", value: "South" },
    { name: "Đồ Khô & Mứt", value: "Dried Foods" },
    { name: "Trà & Cà Phê", value: "Tea Coffee" },
    { name: "Bánh Kẹo", value: "Confectionery" },
    { name: "Nước Chấm", value: "Sauces" },
    { name: "Quà Tặng", value: "Gifts" }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Reset về 8 sản phẩm mỗi khi đổi danh mục hoặc gõ tìm kiếm
  useEffect(() => {
    setVisibleCount(8);
  }, [activeCategory, searchTerm]);

  const handleAddToCart = (product) => {
    addToCart({ ...product, qty: 1 });
    alert(`🛒 Đã thêm ${product.name} vào giỏ hàng!`);
  };

  // 1. LỌC THEO TÌM KIẾM
  const searchResults = products.filter(product => 
    (product.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. LỌC THEO DANH MỤC
  const filteredProductsByCategory = products.filter(product => {
    if (activeCategory === "Tất cả") return true;
    const selectedCat = categories.find(c => c.name === activeCategory);
    const regionCode = selectedCat ? selectedCat.value : "";
    const isMatchRegion = product.region === regionCode;
    const isMatchCategory = product.category === activeCategory;

    return isMatchRegion || isMatchCategory;
  });

  // PHÂN LOẠI CHO BĂNG CHUYỀN SCROLL NGANG (Tối đa 10 món cho mượt)
  const topSelling = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 10);
  const northProducts = products.filter(p => p.region === "North" || p.category === "North").slice(0, 10);
  const centralProducts = products.filter(p => p.region === "Central" || p.category === "Central").slice(0, 10);
  const candyProducts = products.filter(p => (p.category && p.category.toLowerCase().includes('bánh kẹo')) || (p.category && p.category.toLowerCase().includes('confectionery'))).slice(0, 10);

  if (loading) return <div className="text-center mt-20 text-2xl font-bold text-red-800">⏳ Đang bày biện gian hàng...</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-12 pt-6">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">

        {/* =======================================
            CỘT TRÁI: SIDEBAR DANH MỤC
            ======================================= */}
        <div className="hidden lg:block w-1/4 xl:w-1/5 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
            <div className="bg-red-800 text-yellow-400 font-bold p-4 text-lg flex items-center gap-3">
              <span>☰</span> DANH MỤC
            </div>
            <ul className="flex flex-col py-2">
              {categories.map(cat => (
                <li 
                  key={cat.name} 
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-5 py-3 border-b border-gray-50 cursor-pointer font-semibold transition-all duration-200 
                    ${activeCategory === cat.name 
                      ? 'bg-red-50 text-red-700 border-l-4 border-l-red-700 pl-4' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-red-700'
                    }`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* =======================================
            CỘT PHẢI: NỘI DUNG CHÍNH (Banner + Băng chuyền + Lưới)
            ======================================= */}
        <div className="flex-1 min-w-0">
          
          {/* BANNER (Đã đưa vào cột phải) */}
          <div className="bg-red-900 rounded-2xl shadow-sm overflow-hidden relative h-48 md:h-64 mb-8 flex items-center justify-center group">
            <img 
              src="https://images.unsplash.com/photo-1583000570889-7f5fb47eb8de?q=80&w=2000&auto=format&fit=crop" 
              alt="Banner" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="relative z-10 text-center px-4">
              <h2 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-3 tracking-tight drop-shadow-lg">
                TINH HOA HỒN VIỆT
              </h2>
              <p className="text-white text-sm md:text-base font-medium bg-black bg-opacity-40 backdrop-blur-sm inline-block px-5 py-1.5 rounded-full border border-red-800">
                Mang đặc sản mọi miền đến tận mâm cơm nhà bạn
              </p>
            </div>
          </div>

          {/* ĐANG TÌM KIẾM -> HIỂN THỊ KẾT QUẢ DẠNG LƯỚI */}
          {searchTerm ? (
            <div className="mb-10 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-red-800 mb-6 pb-2 border-b-2 border-red-800 inline-block">
                Kết quả tìm kiếm cho: "{searchTerm}"
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.length > 0 ? (
                  searchResults.slice(0, visibleCount).map(product => (
                    // Card hiển thị sản phẩm thu gọn
                    <div key={product._id} className="border border-gray-100 rounded-xl hover:shadow-xl transition-shadow bg-white flex flex-col group overflow-hidden">
                      <Link to={`/product/${product._id}`} className="block h-40 overflow-hidden bg-gray-50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                      </Link>
                      <div className="p-3 flex flex-col flex-1">
                        <h2 className="text-sm font-bold text-gray-800 line-clamp-2">{product.name}</h2>
                        <p className="text-red-600 font-bold text-lg mt-auto mb-2">{product.price.toLocaleString()}đ</p>
                        <button onClick={() => handleAddToCart(product)} className="w-full py-2 rounded-lg text-xs bg-red-700 text-white font-bold hover:bg-red-800 transition">MUA NGAY</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-10">😢 Không tìm thấy món đặc sản nào...</div>
                )}
              </div>
              
              {/* Nút Xem Tất Cả (Khi Tìm Kiếm) */}
              {visibleCount < searchResults.length && (
                <div className="mt-8 text-center">
                  <button onClick={() => setVisibleCount(searchResults.length)} className="px-8 py-2.5 bg-white text-red-700 font-bold rounded-full border border-red-700 hover:bg-red-50 transition shadow-sm">
                    Xem tất cả {searchResults.length - visibleCount} sản phẩm ▾
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* KHÔNG TÌM KIẾM -> HIỂN THỊ CÁC BĂNG CHUYỀN & LƯỚI THEO DANH MỤC */
            <>
              {/* CHỈ HIỆN BĂNG CHUYỀN KHI Ở TRANG "TẤT CẢ" */}
              {activeCategory === "Tất cả" && (
                <>
                  <HorizontalCarousel title="🔥 Nổi Bật" products={topSelling} handleAddToCart={handleAddToCart} /> 
                  <HorizontalCarousel title="🍁 Đặc Sản Miền Bắc" products={northProducts} handleAddToCart={handleAddToCart} onViewAll={() => setActiveCategory("Miền Bắc")} />
                  <HorizontalCarousel title="☀️ Đặc Sản Miền Trung" products={centralProducts} handleAddToCart={handleAddToCart} onViewAll={() => setActiveCategory("Miền Trung")} />
                  <HorizontalCarousel title="🍬 BÁNH KẸO TRUYỀN THỐNG" products={candyProducts} handleAddToCart={handleAddToCart} onViewAll={() => setActiveCategory("Bánh Kẹo")} />
                </>
              )}

              {/* LƯỚI SẢN PHẨM CHÍNH (Gợi ý hoặc theo danh mục đang chọn) */}
              <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100">
                <div className="flex justify-between items-end mb-6 pb-2 border-b border-orange-100">
                  <h3 className="text-xl md:text-2xl font-bold text-red-800 uppercase pl-3 border-l-4 border-yellow-500">
                    {activeCategory === "Tất cả" ? "DÀNH RIÊNG CHO BẠN" : activeCategory}
                  </h3>
                  <span className="text-sm text-gray-500 font-medium">Tìm thấy {filteredProductsByCategory.length} món</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {filteredProductsByCategory.length > 0 ? (
                    filteredProductsByCategory.slice(0, visibleCount).map((product) => (
                      <div key={product._id} className="border border-gray-200 rounded-xl hover:shadow-xl transition-shadow bg-white flex flex-col group overflow-hidden">
                        
                        <Link to={`/product/${product._id}`} className="block h-40 md:h-44 overflow-hidden bg-gray-50">
                          <img src={product.image || 'https://via.placeholder.com/300x300?text=Chưa+có+ảnh'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        </Link>

                        <div className="p-3 md:p-4 flex flex-col flex-1">
                          <Link to={`/product/${product._id}`}>
                            <h2 className="text-sm md:text-base font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-red-700 transition-colors">
                              {product.name}
                            </h2>
                          </Link>
                          <div className="flex-1"></div>
                          <p className="text-red-600 font-bold text-lg md:text-xl mt-2 mb-3">
                            {product.price.toLocaleString()}đ
                          </p>
                          <button onClick={() => handleAddToCart(product)} disabled={product.stock <= 0} className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors ${product.stock > 0 ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'}`}>
                            {product.stock > 0 ? 'MUA NGAY' : 'TẠM HẾT'}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-400">
                      <span className="text-5xl mb-4">🛒</span>
                      <p className="text-lg font-medium">Món này đang bày biện, bạn xem món khác nhé!</p>
                    </div>
                  )}
                </div>

                {/* 👉 NÚT XEM TẤT CẢ CỦA LƯỚI SẢN PHẨM CHÍNH */}
                {visibleCount < filteredProductsByCategory.length && (
                  <div className="mt-10 text-center">
                    <button 
                      onClick={() => setVisibleCount(filteredProductsByCategory.length)} 
                      className="px-8 py-3 bg-white text-red-700 font-bold rounded-full border border-red-700 hover:bg-red-50 hover:shadow-md transition-all"
                    >
                      Xem thêm {filteredProductsByCategory.length - visibleCount} sản phẩm ▾
                    </button>
                  </div>
                )}

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Home;