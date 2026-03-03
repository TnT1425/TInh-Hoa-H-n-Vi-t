import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext'; 
import Register from './pages/Register';
import Cart from './pages/Cart';
import Login from './pages/Login';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-orange-50 font-sans pb-10">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            {}
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;