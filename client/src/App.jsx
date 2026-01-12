import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import LoginComponent from './LoginComponent';
import './App.css';

// Replace with your actual Render backend URL
const API_URL = "https://e-commerce-backend-pk30.onrender.com"; 
const socket = io(API_URL);

function App() {
  // 1. Initialize states
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // Prevents the login kickback
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Define Logout (Clears storage and resets state)
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
      // Only logout if the error is actually a 401 Unauthorized
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  // 4. Initial Auth Check (Runs once when app starts)
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          handleLogout();
        }
      }
      setIsInitializing(false); // Auth check complete
    };

    checkAuth();

    // Socket listeners
    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => 
        p._id === data.id ? { ...p, stock: data.newStock } : p
      ));
    });

    return () => socket.off('stockUpdate');
  }, [handleLogout]);

  // 5. Fetch products whenever user changes
  useEffect(() => {
    if (user && !isInitializing) {
      fetchProducts();
    }
  }, [user, isInitializing, fetchProducts]);

  // 6. Login Handler (Used by LoginComponent)
  const handleLoginData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user); // Triggers re-render to show the store
  };

  const addToCart = (p) => {
    if (p.stock <= 0) return alert("Out of stock!");
    setCart(prev => {
      const exist = prev.find(item => item._id === p._id);
      if (exist) return prev.map(item => item._id === p._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Rendering Logic ---

  // Stop everything while checking for an existing session
  if (isInitializing) {
    return <div className="loader">Authenticating...</div>;
  }

  // Gatekeeper: If no user, show login. If user, show store.
  if (!user) {
    return <LoginComponent onLogin={handleLoginData} API_URL={API_URL} />;
  }

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        <input 
          type="text" 
          placeholder="Search items..." 
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <div className="nav-actions">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="loader">Syncing Inventory...</div>
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
        onConfirm={() => { setIsQRModalOpen(false); alert("Success!"); }} 
      />
    </div>
  );
}

export default App;