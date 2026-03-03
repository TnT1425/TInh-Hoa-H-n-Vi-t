import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 1. Hàm thêm vào giỏ
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  // 2. Hàm xóa khỏi giỏ
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  // 3. Hàm cập nhật số lượng (+ / -)
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart(cart.map(item => item._id === id ? { ...item, qty: newQty } : item));
  };

  // 4. Hàm dọn sạch giỏ hàng (Dùng sau khi thanh toán)
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};