import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// 1. Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BackToTop from './components/layout/BackToTop';

// 2. Product Components
import ProductCard from './components/products/ProductCard';
import Spinner from './components/products/Spinner';

// 3. Modal Components
import CartModal from './components/modals/CartModal';
import QRModal from './components/modals/QRModal';

// 4. Auth & Styles
import LoginComponent from './LoginComponent'; // Move this to /pages later if desired
import './styles/App.css';

const API_URL = "https://e-commerce-backend-pk30.onrender.com";
const socket = io(API_URL);

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // --- Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Calculations ---
  const cartTotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- Auth & Data ---
  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setCart([]);
  }, []);

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
      if (err.response?.status === 401) handleLogout();
    } finally {
      setTimeout(() => setLoading(false), 800); // Slight delay for the "Luxe" spinner to be seen
    }
  }, [handleLogout]);

  useEffect(() => {
    if (user) fetchProducts();
    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => p._id === data.id ? { ...p, stock: data.newStock } : p));
    });
    return () => socket.off('stockUpdate');
  }, [user, fetchProducts]);

  // --- Cart Actions ---
  const addToCart = (product) => {
    if (product.stock <= 0) return;
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
      setCart([]);
      setIsQRModalOpen(false);
      alert("Purchase Successful");
    } catch (err) { console.error(err); }
  };

  if (!user) return <LoginComponent onLogin={(d) => { localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d.user)); setUser(d.user); }} API_URL={API_URL} />;

  // --- Final Filter Logic ---
  const categories = ['All', 'Signature', 'Essentials', 'Limited'];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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

      {/* Category Selection Bar */}
      <div className="category-bar">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="container main-content">
        {loading ? (
          <Spinner />
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={() => addToCart(product)} 
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BackToTop />

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

      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        total={cartTotal} 
        onConfirm={handleConfirmOrder} 
      />
    </div>
  );
}

export default App;