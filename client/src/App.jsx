import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import LoginComponent from './LoginComponent';
import './App.css';

// Ensure this matches your Render URL
const API_URL = "https://e-commerce-backend-pk30.onrender.com"; 
const socket = io(API_URL);

function App() {
  // 1. Persistent State Initialization
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Logic: Logout (Clears storage and resets app)
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setProducts([]);
    setCart([]);
  }, []);

  // 3. Logic: Fetch Products (With Multi-Header Support)
  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    // Stop if no token or no user state yet
    if (!token || !user) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products`, {
        headers: { 
          'x-auth-token': token,        }
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch Error:", err.response?.status);
      
      // ONLY kick to login if it's a confirmed Auth error
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [user, handleLogout]);

  // 4. Effect: Initial Load & Socket Setup
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsInitializing(false);

    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => 
        p._id === data.id ? { ...p, stock: data.newStock } : p
      ));
    });
    return () => socket.off('stockUpdate');
  }, [handleLogout]);

  // 5. Effect: Fetch products when user is ready
  useEffect(() => {
    if (user && !isInitializing) {
      fetchProducts();
    }
  }, [user, isInitializing, fetchProducts]);

  // 6. Logic: Login Handler (Instant Swap)
  const handleLoginData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user); // Triggers immediate view change
  };

  const addToCart = (p) => {
    if (p.stock <= 0) return alert("Out of Stock");
    setCart(prev => {
      const exist = prev.find(item => item._id === p._id);
      if (exist) return prev.map(item => item._id === p._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

const handleConfirmOrder = async () => {
  const token = localStorage.getItem('token');
  
  try {
    // 1. Send each item update to the backend
    // We use Promise.all to run all updates simultaneously
    await Promise.all(cart.map(item => 
      axios.post(`${API_URL}/api/products/update-stock`, 
        { 
          id: item._id, 
          quantity: item.quantity 
        },
        { headers: { 'x-auth-token': token } }
      )
    ));

    // 2. Success Actions
    alert("✨ Payment Confirmed! Your luxury items are on the way.");
    setCart([]); // Clear the cart
    setIsQRModalOpen(false); // Close the modal
    
  } catch (err) {
    console.error("Order Confirmation Error:", err);
    alert("There was an issue processing your order. Please try again.");
  }
};

  // --- RENDERING ---

  if (isInitializing) return <div className="loader">Authenticating...</div>;

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
          <span>{user.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            🛒 ({cart.reduce((s, i) => s + i.quantity, 0)})
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="loader">Opening Vault...</div>
      ) : (
        <main className="product-grid">
          {filteredProducts.map(p => (
            <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} />
          ))}
        </main>
      )}

      <CartModal 
      total={total} 
  cartItems={cart}
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => { setIsCartOpen(false); setIsQRModalOpen(true); }} 
      />

      <QRModal 
  isOpen={isQRModalOpen} 
  onClose={() => setIsQRModalOpen(false)} 
  total={cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)} 
  onConfirm={handleConfirmOrder} 
/>
    </div>
  );
}

export default App;