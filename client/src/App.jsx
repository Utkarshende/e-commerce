import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import LoginComponent from './LoginComponent';
import './App.css';

// Ensure this matches your Render Backend URL exactly
const API_URL = "https://e-commerce-backend-pk30.onrender.com"; 
const socket = io(API_URL);

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Helper to get the auth token from storage
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    return { headers: { 'x-auth-token': token } };
  }, []);

  // 2. Fetch Products (Only called when authenticated)
  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products`, getAuthHeader());
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      // If unauthorized (401), force a logout
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // 3. Initial Load: Check for existing session and Setup Socket
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => 
        p._id === data.id ? { ...p, stock: data.newStock } : p
      ));
    });

    return () => socket.off('stockUpdate');
  }, []);

  // 4. Fetch products whenever the user state becomes valid
  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user, fetchProducts]);

  const handleLoginData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setProducts([]);
    setCart([]);
  };

  const addToCart = (p) => {
    if (p.stock <= 0) return alert("Item out of stock!");
    setCart(prev => {
      const exist = prev.find(item => item._id === p._id);
      if (exist) return prev.map(item => item._id === p._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const confirmPayment = async () => {
    try {
      await axios.post(`${API_URL}/api/products/update-stock`, { items: cart }, getAuthHeader());
      
      const newOrder = {
        id: `#LUXE-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString(),
        total: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      };

      const updatedUser = { ...user, orders: [newOrder, ...(user.orders || [])] };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCart([]);
      setIsQRModalOpen(false);
      alert("Success! Your order is confirmed.");
    } catch (err) {
      alert("Payment failed. Please log in again.");
      handleLogout();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not logged in, show login screen
  if (!user) {
    return <LoginComponent onLogin={handleLoginData} API_URL={API_URL} />;
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        <input 
          type="text" 
          placeholder="Search items..." 
          className="search-bar"
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <div className="nav-right">
          <span>Hello, {user.name}</span>
          <button onClick={handleLogout} className="logout-link">Logout</button>
          <div className="cart-trigger" onClick={() => setIsCartOpen(true)}>
             🛒 ({cart.reduce((s, i) => s + i.quantity, 0)})
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="loading-state">Loading Premium Collections...</div>
      ) : (
        <main className="product-grid">
          {filteredProducts.map(p => (
            <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} />
          ))}
        </main>
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
        onConfirm={confirmPayment} 
      />
    </div>
  );
}

export default App;