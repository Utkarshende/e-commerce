import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import LoginComponent from './LoginComponent';
import './App.css';

const API_URL = "https://e-commerce-backend-pk30.onrender.com"; 
const socket = io(API_URL);

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setProducts([]);
    setCart([]);
  }, []);

  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    // CRITICAL FIX: If token is missing, do not attempt the call
    if (!token || !user) return; 

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products`, {
        headers: { 'x-auth-token': token }
      });
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [user, handleLogout]);

  useEffect(() => {
    // Only fetch if we actually have a user session
    if (user) {
      fetchProducts();
    }

    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => 
        p._id === data.id ? { ...p, stock: data.newStock } : p
      ));
    });

    return () => socket.off('stockUpdate');
  }, [user, fetchProducts]);

  const handleLoginData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Instant switch
    setUser(data.user); 
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return <LoginComponent onLogin={handleLoginData} API_URL={API_URL} />;
  }

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        <div className="nav-right">
          <span>{user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <div className="cart-btn" onClick={() => setIsCartOpen(true)}>
            🛒 {cart.length}
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="status">Loading Collections...</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(p => (
            <ProductCard key={p._id} product={p} onAddToCart={() => {}} />
          ))}
        </div>
      )}

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} />
    </div>
  );
}

export default App;