import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import LoginComponent from './LoginComponent';
import './App.css';

// Ensure this URL is correct for your Render backend
const API_URL = "https://e-commerce-backend-pk30.onrender.com";
const socket = io(API_URL);

function App() {
  // --- 1. State ---
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- 2. Derived State (Totals) ---
  const cartTotal = cart.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + (price * qty);
  }, 0);

  // --- 3. Authentication Logic ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    setProducts([]);
  }, []);

  const handleLoginData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  // --- 4. API Calls ---
  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products`, {
        headers: { 'x-auth-token': token }
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch Products Error:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [user, handleLogout]);

  // NEW: Handle Order Confirmation & Stock Reduction
  const handleConfirmOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Send stock updates for all items in the cart
      await Promise.all(cart.map(item => 
        axios.post(`${API_URL}/api/products/update-stock`, 
          { 
            id: item._id, 
            quantity: item.quantity 
          },
          { headers: { 'x-auth-token': token } }
        )
      ));

      alert("✨ Payment Confirmed! Your items are on the way.");
      setCart([]); // Clear cart locally
      setIsQRModalOpen(false); // Close the QR Modal
    } catch (err) {
      console.error("Order Error:", err);
      alert(err.response?.data?.message || "Order processing failed. Please try again.");
    }
  };

  // --- 5. Side Effects ---
  useEffect(() => {
    if (user) {
      fetchProducts();
    }

    // Real-time listener for stock changes
    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => 
        p._id === data.id ? { ...p, stock: data.newStock } : p
      ));
    });

    return () => socket.off('stockUpdate');
  }, [user, fetchProducts]);

  // --- 6. Helper Functions ---
  const addToCart = (product) => {
    if (product.stock <= 0) return alert("Item out of stock!");
    
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- 7. Conditional Rendering ---
  if (!user) {
    return <LoginComponent onLogin={handleLoginData} API_URL={API_URL} />;
  }

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        <div className="nav-right">
          <input 
            type="text" 
            placeholder="Search luxury..." 
            className="search-bar"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="cart-trigger" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="cart-count">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      {loading ? (
        <div className="loader">Opening the vault...</div>
      ) : (
        <main className="product-grid">
          {filteredProducts.map(p => (
            <ProductCard 
              key={p._id} 
              product={p} 
              onAddToCart={() => addToCart(p)} 
            />
          ))}
        </main>
      )}

      {/* MODALS */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        total={cartTotal}
        onIncrease={(item) => addToCart(item)}
        onDecrease={(id) => updateQuantity(id, -1)}
        clearCart={() => setCart([])}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsQRModalOpen(true);
        }}
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