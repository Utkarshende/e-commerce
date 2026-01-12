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
  // 1. Initial States
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

  // 2. Define Logout FIRST (To avoid "Initialization" errors)
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setProducts([]);
    setCart([]);
  }, []);

  // 3. Define Fetch Products
  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return; 

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
  }, [handleLogout]);

  // 4. Effects (These run AFTER the functions above are defined)
  useEffect(() => {
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

  // 5. Action Handlers
  const handleLoginData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user); // Instant transition
  };

  const addToCart = (p) => {
    if (p.stock <= 0) return alert("Out of stock");
    setCart(prev => {
      const exist = prev.find(item => item._id === p._id);
      if (exist) return prev.map(item => item._id === p._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 6. View Logic
  if (!user) {
    return <LoginComponent onLogin={handleLoginData} API_URL={API_URL} />;
  }

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE</h1>
        <input 
          type="text" 
          placeholder="Search collections..." 
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <div className="nav-actions">
          <span>{user.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="loader">Updating Inventory...</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(p => (
            <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} />
          ))}
        </div>
      )}

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onCheckout={() => { setIsCartOpen(false); setIsQRModalOpen(true); }} 
      />

      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        onConfirm={() => { setIsQRModalOpen(false); alert("Order Placed!"); }} 
      />
    </div>
  );
}

export default App;