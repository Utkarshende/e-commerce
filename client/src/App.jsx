import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import LoginComponent from './LoginComponent'; // FIXED: Added missing import
import './App.css';

const API_URL = "https://e-commerce-backend-pk30.onrender.com"; 
const socket = io(API_URL);

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to get the security header
  const getAuthHeader = () => ({
    headers: { 'x-auth-token': localStorage.getItem('token') }
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const fetchProducts = async () => {
      try {
        // Send token so backend allows the request
        const res = await axios.get(`${API_URL}/api/products`, getAuthHeader());
        setProducts(res.data);
      } catch (err) {
        if (err.response?.status === 401) handleLogout();
      }
    };

    if (localStorage.getItem('token')) fetchProducts();

    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => p._id === data.id ? { ...p, stock: data.newStock } : p));
    });
    return () => socket.off('stockUpdate');
  }, [user]);

  const handleLoginData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const confirmPayment = async () => {
    const newOrder = {
      id: `#LUXE-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      items: cart.map(i => ({ name: i.name, quantity: i.quantity })),
      total: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    };
    
    try {
      // Send token with stock update request
      await axios.post(`${API_URL}/api/products/update-stock`, { items: cart }, getAuthHeader());
      
      const updatedUser = { ...user, orders: [newOrder, ...user.orders] };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCart([]);
      setIsQRModalOpen(false);
      alert("🎉 Success!");
    } catch (err) {
      alert("Session expired. Please login again.");
      handleLogout();
    }
  };

  const addToCart = (p) => {
    setCart(prev => {
      const exist = prev.find(item => item._id === p._id);
      if (exist) return prev.map(item => item._id === p._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!user) return <LoginComponent onLogin={handleLoginData} API_URL={API_URL} />;

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        <input type="text" className="search-input" placeholder="Search..." onChange={(e) => setSearchQuery(e.target.value)} />
        <div className="nav-actions">
          <span>{user.name}</span>
          <button onClick={handleLogout} className="logout-link">Logout</button>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            🛒 <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
        </div>
      </nav>

      {user.orders?.length > 0 && (
        <div className="order-history-banner">
          <h3>Recent Orders</h3>
          <div className="orders-list">
            {user.orders.map((o, i) => (
              <div key={i} className="order-mini-card"><strong>{o.id}</strong> - ${o.total.toFixed(2)}</div>
            ))}
          </div>
        </div>
      )}

      <main className="product-grid">
        {filteredProducts.map(p => <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} />)}
      </main>

      <CartModal 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} total={total}
        onIncrease={addToCart} onDecrease={(id) => setCart(c => c.map(i => i._id === id ? {...i, quantity: i.quantity-1} : i).filter(i => i.quantity > 0))}
        onCheckout={() => { setIsCartOpen(false); setIsQRModalOpen(true); }} clearCart={() => setCart([])}
      />

      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} total={total} onConfirm={confirmPayment} />
    </div>
  );
}

export default App;