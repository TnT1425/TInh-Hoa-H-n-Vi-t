
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return 'guest'; 
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id || 'user'; 
  } catch (error) {
    return 'user';
  }
};

export const CartProvider = ({ children }) => {
  const userId = getUserIdFromToken();
  const cartStorageKey = `cartData_${userId}`;

  // Khi tải giỏ hàng lên, mặc định gán thêm thuộc tính selected: true cho các sản phẩm cũ
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(cartStorageKey);
    return savedCart ? JSON.parse(savedCart).map(item => ({ ...item, selected: item.selected ?? true })) : [];
  });

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        // Mặc định sản phẩm mới thêm vào sẽ được tích chọn (selected: true)
        return [...prevCart, { ...product, qty: 1, selected: true }];
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
    localStorage.removeItem(cartStorageKey); 
  };

  // --- 3 HÀM MỚI ĐƯỢC THÊM VÀO ĐỂ XỬ LÝ CHECKBOX ---
  
  // 1. Tích/Bỏ tích 1 sản phẩm
  const toggleSelection = (id) => {
    setCart(cart.map(item => item._id === id ? { ...item, selected: !item.selected } : item));
  };

  // 2. Tích/Bỏ tích TẤT CẢ sản phẩm
  const toggleAllSelection = (isSelectAll) => {
    setCart(cart.map(item => ({ ...item, selected: isSelectAll })));
  };

  // 3. Xóa những sản phẩm đã được thanh toán thành công khỏi giỏ
  const clearSelectedCart = () => {
    setCart(cart.filter(item => !item.selected));
  };

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      toggleSelection, toggleAllSelection, clearSelectedCart // Xuất các hàm mới ra
    }}>
      {children}
    </CartContext.Provider>
  );
};