import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import Navbar from './Navbar';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import LoginComponent from './LoginComponent';
import './App.css';
import Footer from './Footer';

const API_URL = "https://e-commerce-backend-pk30.onrender.com";
const socket = io(API_URL);

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // 1. Scroll Listener for Rich Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Calculated Totals
  const cartTotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 3. Auth Handlers
  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setCart([]);
  }, []);

  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/api/products`, { headers: { 'x-auth-token': token } });
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  }, [handleLogout]);

  // 4. Socket & Data Lifecycle
  useEffect(() => {
    if (user) fetchProducts();
    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => p._id === data.id ? { ...p, stock: data.newStock } : p));
    });
    return () => socket.off('stockUpdate');
  }, [user, fetchProducts]);

  // 5. Cart Functions
  const addToCart = (product) => {
    if (product.stock <= 0) return alert("Sold Out");
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
      .filter(item => item.quantity > 0));
  };

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      await Promise.all(cart.map(item => 
        axios.post(`${API_URL}/api/products/update-stock`, { id: item._id, quantity: item.quantity }, { headers: { 'x-auth-token': token } })
      ));
      alert("✨ Order Confirmed!");
      setCart([]);
      setIsQRModalOpen(false);
    } catch (err) { alert("Checkout failed. Try again."); }
  };

  if (!user) return <LoginComponent onLogin={(d) => { localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d.user)); setUser(d.user); }} API_URL={API_URL} />;

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="app-wrapper">
      <Navbar 
        scrolled={scrolled} 
        user={user} 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)} 
        onLogout={handleLogout} 
        onSearch={setSearchQuery} 
      />

      <main className="container content-grid" style={{ paddingTop: '40px' }}>
        <div className="product-grid">
          {filteredProducts.map(p => <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} />)}
        </div>
      </main>

      <Footer />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        total={cartTotal} 
        onIncrease={addToCart} 
        onDecrease={(id) => updateQuantity(id, -1)} 
        clearCart={() => setCart([])} 
        onCheckout={() => { setIsCartOpen(false); setIsQRModalOpen(true); }} 
      />

      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} total={cartTotal} onConfirm={handleConfirmOrder} />
    </div>
  );
}

export default App;