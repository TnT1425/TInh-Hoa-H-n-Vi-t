// import React, { useState, useContext, useEffect } from 'react';
// import { CartContext } from '../context/CartContext';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';


// const Checkout = () => {
//   const { cart, clearCart } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [shippingInfo, setShippingInfo] = useState({ fullName: '', phone: '', address: '' });

//   const handlePhoneChange = (e) => {
//     const value = e.target.value.replace(/\D/g, ''); // Chỉ cho phép số
//     if (value.length <= 10) {
//       setShippingInfo({ ...shippingInfo, phone: value });
//     }
//   };

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const res = await axios.get('http://localhost:5000/api/auth/profile', {
//             headers: { Authorization: `Bearer ${token}`, token: `Bearer ${token}` }
//           });

//           setShippingInfo({
//             fullName: res.data.name || '',
//             phone: res.data.phone || '',
//             address: res.data.address || ''
//           });
//         } catch (error) {
//           console.error('Không tải được thông tin cá nhân', error);
//         }
//       }
//     };
//     fetchUserProfile();
//   }, []);

//   const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);
//   const [paymentMethod, setPaymentMethod] = useState('COD');


//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
    
//     // Kiểm tra xem khách đã đăng nhập chưa
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Vui lòng đăng nhập tài khoản trước khi đặt hàng!');
//       navigate('/login');
//       return;
//     }

//     try {
//       const orderData = {
//         customerName: shippingInfo.fullName,
//         phone: shippingInfo.phone,
//         address: shippingInfo.address,
//         paymentMethod: paymentMethod,
//         items: cart.map(item => ({ 
//           product: item._id, 
//           qty: item.qty, 
//           name: item.name 
//         }))
//       };

//       await axios.post('http://localhost:5000/api/orders', orderData, {
//         headers: { token: `Bearer ${token}`,
//         Authorization: `Bearer ${token}` }
//       });

//       alert(' Đặt hàng thành công!');
//       clearCart(); 
//       navigate('/cart'); 
//     } catch (error) {
//       alert('❌ Lỗi đặt hàng: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
//     }
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="text-center mt-20">
//         <h2 className="text-2xl font-bold mb-4 text-gray-700">Giỏ hàng đang trống!</h2>
//         <Link to="/" className="text-red-600 underline text-lg font-semibold hover:text-red-800">Quay lại mua sắm</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 mt-8">
//       <h1 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-800 pb-2">Thanh Toán Đơn Hàng</h1>
      
//       <div className="flex flex-col md:flex-row gap-8">
//         <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md border border-gray-100">
//           <h2 className="text-xl font-bold mb-6 text-gray-700">Thông tin giao hàng</h2>
//           <form onSubmit={handlePlaceOrder} className="space-y-5" id="checkout-form">
//             <div>
//               <label className="block text-gray-700 font-bold mb-1">Họ và tên người nhận</label>
//               <input type="text" required className="w-full border p-3 rounded bg-gray-50 focus:bg-white" placeholder="VD: Nguyễn Văn A"
//                value={shippingInfo.fullName} onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})} />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-bold mb-1">Số điện thoại liên hệ</label>
//               <input type="tel" required maxLength="10" className="w-full border p-3 rounded bg-gray-50 focus:bg-white" placeholder="VD: 0912345678"
//                 value={shippingInfo.phone} onChange={handlePhoneChange} />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-bold mb-1">Địa chỉ giao hàng chi tiết</label>
//               <textarea required className="w-full border p-3 rounded bg-gray-50 focus:bg-white h-24" placeholder="Số nhà, Tên đường, Phường/Xã..."
//                 value={shippingInfo.address} onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}></textarea>
//             </div>
//             {/* ==========================================
//             KHU VỰC CHỌN PHƯƠNG THỨC THANH TOÁN
//             ========================================== */}
//         <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-red-700 pl-3">
//             Phương thức thanh toán
//           </h3>
          
//           <div className="space-y-3">
//             {/* Lựa chọn 1: Tiền mặt (COD) */}
//             <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-red-700 bg-red-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
//               <input 
//                 type="radio" 
//                 name="payment" 
//                 value="COD" 
//                 checked={paymentMethod === 'COD'} 
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="mr-4 w-5 h-5 accent-red-700"
//               />
//               <div className="flex items-center gap-3">
//                 <span className="text-3xl">💵</span>
//                 <div>
//                   <p className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</p>
//                   <p className="text-sm text-gray-500">Khách hàng thanh toán bằng tiền mặt cho nhân viên giao hàng.</p>
//                 </div>
//               </div>
//             </label>

//             {/* Lựa chọn 2: Chuyển khoản QR */}
//             <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Banking' ? 'border-blue-700 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
//               <input 
//                 type="radio" 
//                 name="payment" 
//                 value="Banking" 
//                 checked={paymentMethod === 'Banking'} 
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="mr-4 w-5 h-5 accent-blue-700"
//               />
//               <div className="flex items-center gap-3">
//                 <span className="text-3xl">🏦</span>
//                 <div>
//                   <p className="font-bold text-gray-800">Chuyển khoản / Quét mã QR</p>
//                   <p className="text-sm text-gray-500">Mở App ngân hàng bất kỳ để quét mã. Tự động xác nhận.</p>
//                 </div>
//               </div>
//             </label>
//           </div>

//           {paymentMethod === 'Banking' && (
//             <div className="mt-5 p-5 bg-white border-2 border-dashed border-blue-300 rounded-xl text-center">
//               <h4 className="font-bold text-blue-800 mb-2 uppercase text-sm tracking-wide">Quét mã để thanh toán</h4>
              
//               {/* API VIETQR TỰ ĐỘNG TẠO MÃ */}
//               {/* Cú pháp: https://img.vietqr.io/image/<Mã_Ngân_Hàng>-<Số_Tài_Khoản>-print.png?amount=<Số_Tiền>&addInfo=<Nội_Dung>&accountName=<Tên_Chủ_TK> */}
//               <img 
//                 src={`https://img.vietqr.io/image/MB-020520048668-print.png?amount=${totalPrice}&addInfo=Thanh toan don hang Tinh Hoa Hon Viet&accountName=TRAN NGOC TRUNG`} 
//                 alt="QR Thanh Toán" 
//                 className="mx-auto w-56 h-56 object-contain rounded-lg shadow-sm border border-gray-100"
//               />
              
//               <div className="mt-4 text-left bg-blue-50 p-4 rounded-lg text-sm text-blue-900 border border-blue-100 grid grid-cols-3 gap-2">
//                 <p className="col-span-1 text-gray-500 font-medium">Ngân hàng:</p>
//                 <p className="col-span-2 font-bold">MB Bank</p>
                
//                 <p className="col-span-1 text-gray-500 font-medium">Chủ tài khoản:</p>
//                 <p className="col-span-2 font-bold uppercase">TRAN NGOC TRUNG</p>
                
//                 <p className="col-span-1 text-gray-500 font-medium">Số tài khoản:</p>
//                 <p className="col-span-2 font-bold text-lg tracking-wider">020520048668</p>
                
//                 <p className="col-span-1 text-gray-500 font-medium">Số tiền cần CK:</p>
//                 <p className="col-span-2 font-bold text-red-600 text-lg">{totalPrice.toLocaleString()} VNĐ</p>
//               </div>
//               <p className="text-xs text-red-500 font-medium mt-3 italic">* Vui lòng không thay đổi nội dung chuyển khoản để hệ thống duyệt tự động.</p>
//             </div>
//           )}
//         </div>
//           </form>
//         </div>

//         <div className="md:w-1/3 bg-orange-50 p-6 rounded-lg shadow-md h-fit border-t-4 border-yellow-500">
//           <h2 className="text-xl font-bold mb-4 text-red-800">Đơn hàng của bạn</h2>
//           <div className="max-h-60 overflow-y-auto mb-4 border-b border-orange-200 pb-4 pr-2">
//             {cart.map((item, index) => (
//               <div key={index} className="flex justify-between items-center mb-4">
//                 <div className="text-gray-700">
//                   <span className="font-bold">{item.name}</span> <br/>
//                   <span className="text-sm text-gray-500">Số lượng: <strong className="text-red-600">{item.qty}</strong></span>
//                 </div>
//                 <div className="font-bold text-gray-800">
//                   {(item.price * item.qty).toLocaleString()} đ
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="flex justify-between text-lg font-bold mt-4 pt-2">
//             <span className="text-gray-700">Tổng thanh toán:</span>
//             <span className="text-red-700 text-2xl">{totalPrice.toLocaleString()} VNĐ</span>
//           </div>

//           <button type="submit" form="checkout-form" className="w-full bg-red-700 text-white font-bold py-4 mt-6 rounded-lg hover:bg-red-800 transition shadow-lg text-lg uppercase">
//             Xác nhận đặt hàng
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearSelectedCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({ fullName: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // BỘ LỌC QUAN TRỌNG: Chỉ lấy những món đã tích chọn
  const checkoutItems = cart.filter(item => item.selected);
  const totalPrice = checkoutItems.reduce((total, item) => total + item.price * item.qty, 0);

  // Nếu truy cập thẳng vào trang checkout mà không có món nào được chọn, đẩy về giỏ hàng
  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate('/cart');
    }
  }, [checkoutItems, navigate]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); 
    if (value.length <= 10) {
      setShippingInfo({ ...shippingInfo, phone: value });
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}`, token: `Bearer ${token}` }
          });
          setShippingInfo({
            fullName: res.data.name || '',
            phone: res.data.phone || '',
            address: res.data.address || ''
          });
        } catch (error) {
          console.error('Không tải được thông tin cá nhân', error);
        }
      }
    };
    fetchUserProfile();
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập tài khoản trước khi đặt hàng!');
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        customerName: shippingInfo.fullName,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        paymentMethod: paymentMethod,
        // CHỈ gửi những món đã chọn lên API Đặt hàng
        items: checkoutItems.map(item => ({ 
          product: item._id, 
          qty: item.qty, 
          name: item.name 
        }))
      };

      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { token: `Bearer ${token}`, Authorization: `Bearer ${token}` }
      });

      alert(' Đặt hàng thành công!');
      
      // CHỈ xóa những món đã đặt ra khỏi giỏ hàng, giữ lại món chưa chọn
      clearSelectedCart(); 
      navigate('/cart'); 
    } catch (error) {
      alert('❌ Lỗi đặt hàng: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
    }
  };

  if (checkoutItems.length === 0) return null; // Tránh render nhấp nháy trước khi redirect

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-800 pb-2">Thanh Toán Đơn Hàng</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-700">Thông tin giao hàng</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-5" id="checkout-form">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Họ và tên người nhận</label>
              <input type="text" required className="w-full border p-3 rounded bg-gray-50 focus:bg-white" placeholder="VD: Nguyễn Văn A"
               value={shippingInfo.fullName} onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Số điện thoại liên hệ</label>
              <input type="tel" required maxLength="10" className="w-full border p-3 rounded bg-gray-50 focus:bg-white" placeholder="VD: 0912345678"
                value={shippingInfo.phone} onChange={handlePhoneChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Địa chỉ giao hàng chi tiết</label>
              <textarea required className="w-full border p-3 rounded bg-gray-50 focus:bg-white h-24" placeholder="Số nhà, Tên đường, Phường/Xã..."
                value={shippingInfo.address} onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}></textarea>
            </div>
            
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-red-700 pl-3">Phương thức thanh toán</h3>
          <div className="space-y-3">
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-red-700 bg-red-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-4 w-5 h-5 accent-red-700" />
              <div className="flex items-center gap-3">
                <span className="text-3xl">💵</span>
                <div>
                  <p className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm text-gray-500">Khách hàng thanh toán bằng tiền mặt cho nhân viên giao hàng.</p>
                </div>
              </div>
            </label>

            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Banking' ? 'border-blue-700 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="payment" value="Banking" checked={paymentMethod === 'Banking'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-4 w-5 h-5 accent-blue-700" />
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏦</span>
                <div>
                  <p className="font-bold text-gray-800">Chuyển khoản / Quét mã QR</p>
                  <p className="text-sm text-gray-500">Mở App ngân hàng bất kỳ để quét mã. Tự động xác nhận.</p>
                </div>
              </div>
            </label>
          </div>

          {paymentMethod === 'Banking' && (
            <div className="mt-5 p-5 bg-white border-2 border-dashed border-blue-300 rounded-xl text-center">
              <h4 className="font-bold text-blue-800 mb-2 uppercase text-sm tracking-wide">Quét mã để thanh toán</h4>
              <img 
                src={`https://img.vietqr.io/image/MB-020520048668-print.png?amount=${totalPrice}&addInfo=Thanh toan don hang Tinh Hoa Hon Viet&accountName=TRAN NGOC TRUNG`} 
                alt="QR Thanh Toán" 
                className="mx-auto w-56 h-56 object-contain rounded-lg shadow-sm border border-gray-100"
              />
              <div className="mt-4 text-left bg-blue-50 p-4 rounded-lg text-sm text-blue-900 border border-blue-100 grid grid-cols-3 gap-2">
                <p className="col-span-1 text-gray-500 font-medium">Ngân hàng:</p>
                <p className="col-span-2 font-bold">MB Bank</p>
                
                <p className="col-span-1 text-gray-500 font-medium">Chủ tài khoản:</p>
                <p className="col-span-2 font-bold uppercase">TRAN NGOC TRUNG</p>
                
                <p className="col-span-1 text-gray-500 font-medium">Số tài khoản:</p>
                <p className="col-span-2 font-bold text-lg tracking-wider">020520048668</p>
                
                <p className="col-span-1 text-gray-500 font-medium">Số tiền cần CK:</p>
                <p className="col-span-2 font-bold text-red-600 text-lg">{totalPrice.toLocaleString()} VNĐ</p>
              </div>
              <p className="text-xs text-red-500 font-medium mt-3 italic">* Vui lòng không thay đổi nội dung chuyển khoản để hệ thống duyệt tự động.</p>
            </div>
          )}
        </div>
          </form>
        </div>

        <div className="md:w-1/3 bg-orange-50 p-6 rounded-lg shadow-md h-fit border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold mb-4 text-red-800">Đơn hàng của bạn</h2>
          <div className="max-h-60 overflow-y-auto mb-4 border-b border-orange-200 pb-4 pr-2">
            {/* Render các sản phẩm đã được lọc */}
            {checkoutItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <div className="text-gray-700">
                  <span className="font-bold">{item.name}</span> <br/>
                  <span className="text-sm text-gray-500">Số lượng: <strong className="text-red-600">{item.qty}</strong></span>
                </div>
                <div className="font-bold text-gray-800">
                  {(item.price * item.qty).toLocaleString()} đ
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-lg font-bold mt-4 pt-2">
            <span className="text-gray-700">Tổng thanh toán:</span>
            <span className="text-red-700 text-2xl">{totalPrice.toLocaleString()} VNĐ</span>
          </div>

          <button type="submit" form="checkout-form" className="w-full bg-red-700 text-white font-bold py-4 mt-6 rounded-lg hover:bg-red-800 transition shadow-lg text-lg uppercase">
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;