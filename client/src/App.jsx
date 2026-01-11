import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import LoginComponent from './LoginComponent';
import Spinner from './Spinner'; // Import your new Spinner
import './App.css';

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

  // 1. Memoized Header Function (Prevents recreation on every render)
  const getAuthHeader = useCallback(() => ({
    headers: { 'x-auth-token': localStorage.getItem('token') }
  }), []);

  // 2. Fetch Products Function
  const fetchProducts = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products`, getAuthHeader());
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // 3. Effect for Initialization and Socket
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => p._id === data.id ? { ...p, stock: data.newStock } : p));
    });

    return () => socket.off('stockUpdate');
  }, []); // Only runs once on mount

  // 4. Effect to fetch products ONLY when user state changes
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
    localStorage.clear();
    setUser(null);
    setProducts([]);
    setCart([]);
  };

  const addToCart = (p) => {
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
      alert("Payment Confirmed! Stock Updated.");
    } catch (err) {
      alert("Payment failed. Please login again.");
      handleLogout();
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Render Login if no user
  if (!user) return <LoginComponent onLogin={handleLoginData} API_URL={API_URL} />;

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search collections..." 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <div className="nav-actions">
          <span className="user-name">Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="cart-badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
        </div>
      </nav>

      {user.orders?.length > 0 && (
        <div className="order-history-banner">
          <h3>Recent Purchases</h3>
          <div className="orders-list">
            {user.orders.slice(0, 3).map((o, i) => (
              <div key={i} className="order-mini-card">
                <strong>{o.id}</strong> | ${o.total.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <main className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => (
              <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} />
            ))
          ) : (
            <p className="no-results">No products found matching your search.</p>
          )}
        </main>
      )}

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        total={total}
        onIncrease={addToCart} 
        onDecrease={(id) => setCart(c => c.map(i => i._id === id ? {...i, quantity: i.quantity-1} : i).filter(i => i.quantity > 0))}
        onCheckout={() => { setIsCartOpen(false); setIsQRModalOpen(true); }} 
        clearCart={() => setCart([])}
      />

      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        total={total} 
        onConfirm={confirmPayment} 
      />
    </div>
  );
}

export default App;