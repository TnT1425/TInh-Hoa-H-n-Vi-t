import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#fdfaf6] border-t border-gray-200 pt-12 pb-6 text-sm text-gray-700 print:hidden mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* CỘT 1: Về chúng tôi */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-base">Về chúng tôi</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-700 transition">Câu chuyện</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Giới thiệu chung</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Nhận diện thương hiệu</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Tầm nhìn - Sứ mệnh</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Triết lý kinh doanh</a></li>
          </ul>
        </div>

        {/* CỘT 2: Sản phẩm */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-base">Sản phẩm</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-700 transition">Giải pháp quà tặng, quà biếu</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Đặc sản 3 miền</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Bánh - Kẹo truyền thống</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Trà, Cà phê đặc sản</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Gia vị, Nước chấm</a></li>
          </ul>
        </div>

        {/* CỘT 3: Hỗ trợ khách hàng */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-base">Hỗ trợ khách hàng</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-700 transition">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Chính sách đổi - trả hàng</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Câu hỏi thường gặp</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Liên hệ</a></li>
            <li><a href="#" className="hover:text-red-700 transition">Tra cứu đơn hàng</a></li>
          </ul>
        </div>

        {/* CỘT 4: Liên hệ */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-base">Bán hàng trực tuyến & CSKH</h3>
          <div className="space-y-2 mb-4">
            <p className="flex items-center gap-2">📞 <span className="font-bold">Hotline:</span> 1900 8122</p>
            <p className="flex items-center gap-2">✉️ <span className="font-bold">Email:</span> cskh@tinhhoahonviet.vn</p>
            <p className="flex items-start gap-2 mt-4">📍 <span className="font-bold">Cửa hàng:</span> KM10 Trần Phú, Hà Đông, Hà Nội</p>
          </div>
          <h3 className="font-bold text-gray-900 mb-4 text-base">Kết nối với chúng tôi</h3>
          <a 
            href="https://web.facebook.com/profile.php?id=61577253477717" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-md group"
          >
            {/* Chữ f logo của Facebook */}
            <span className="text-2xl font-serif font-black -mt-1 group-hover:scale-110 transition-transform">f</span> 
            Theo dõi Fanpage
          </a>
        </div>

      </div>

      <div className="text-center mt-10 pt-4 border-t border-gray-200 text-gray-500 font-medium">
        © 2026 Tinh Hoa Hồn Việt – Trao niềm tin, nhận chất lượng.
      </div>
    </footer>
  );
};

export default Footer;