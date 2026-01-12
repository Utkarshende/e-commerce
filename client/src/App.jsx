import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Components
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import LoginComponent from './LoginComponent';

// Styles
import './App.css';

const API_URL = "https://e-commerce-backend-pk30.onrender.com";
const socket = io(API_URL);

function App() {
  // --- 1. State Management ---
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // --- 2. Calculated Values ---
  const cartTotal = cart.reduce((acc, item) => {
    return acc + (Number(item.price) || 0) * (item.quantity || 1);
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- 3. Authentication Handlers ---
  const handleLoginData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setCart([]);
    setProducts([]);
  }, []);

  // --- 4. API & Data Fetching ---
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
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  // --- 5. Order Processing ---
  const handleConfirmOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      // Loop through cart and update stock for each item
      await Promise.all(cart.map(item => 
        axios.post(`${API_URL}/api/products/update-stock`, 
          { id: item._id, quantity: item.quantity },
          { headers: { 'x-auth-token': token } }
        )
      ));

      alert("✨ Purchase Successful! Your luxury items are reserved.");
      setCart([]);
      setIsQRModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Internal Server Error during checkout");
    }
  };

  // --- 6. Lifecycle & Sockets ---
  useEffect(() => {
    if (user) fetchProducts();

    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => 
        p._id === data.id ? { ...p, stock: data.newStock } : p
      ));
    });

    return () => socket.off('stockUpdate');
  }, [user, fetchProducts]);

  // --- 7. Cart Interaction Helpers ---
  const addToCart = (product) => {
    if (product.stock <= 0) return alert("Item out of stock");
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // --- 8. Render Logic ---
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return <LoginComponent onLogin={handleLoginData} API_URL={API_URL} />;
  }

  return (
    <div className="app-wrapper">
      <Navbar 
        user={user}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onLogout={handleLogout}
        onSearch={setSearchQuery}
      />

      <main className="container main-content">
        {loading ? (
          <div className="loader">Curating collection...</div>
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

      {/* Modals Section */}
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