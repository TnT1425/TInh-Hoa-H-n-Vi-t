import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

// HÀM BÍ MẬT: Giải mã Token để lấy ID của người đang đăng nhập
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return 'guest'; // Nếu chưa đăng nhập thì là khách
  
  try {
    // Dịch ngược đoạn mã Token của Backend để lấy ID người dùng
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id || 'user'; 
  } catch (error) {
    return 'user';
  }
};

export const CartProvider = ({ children }) => {
  // 1. Tạo "Chìa khóa" ngăn kéo riêng cho từng tài khoản
  const userId = getUserIdFromToken();
  const cartStorageKey = `cartData_${userId}`; // Kết quả: cartData_64a1b2c3...

  // 2. Mở đúng ngăn kéo của người đó ra để lấy giỏ hàng
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(cartStorageKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 3. Mỗi khi giỏ hàng thay đổi, cất đúng vào ngăn kéo của người đó
  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  // Các hàm xử lý giữ nguyên
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart(cart.map(item => item._id === id ? { ...item, qty: newQty } : item));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(cartStorageKey); // Thanh toán xong thì xóa đúng ngăn của người này
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};