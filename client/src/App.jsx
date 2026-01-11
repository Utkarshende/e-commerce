import { useState, useEffect } from 'react';
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
  // --- States ---
  const [user, setUser] = useState(null); // Auth State
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Effects ---
  useEffect(() => {
    // Check if user is already logged in (Local Storage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) { console.error("Fetch Error:", err); }
    };
    fetchProducts();

    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => p._id === data.id ? { ...p, stock: data.newStock } : p));
    });

    return () => socket.off('stockUpdate');
  }, []);

  // --- Auth Handlers ---
  const handleLoginData = (data) => {
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // Persist user session
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  // --- Cart & Order Logic ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prev) => prev.map(item => item._id === id ? { ...item, quantity: item.quantity - 1 } : item)
      .filter(item => item.quantity > 0));
  };

  const confirmPayment = async () => {
    const newOrder = {
      id: `#LUXE-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      items: cart.map(item => ({ name: item.name, quantity: item.quantity })),
      total: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    };
    
    try {
      // Update stock in DB and save order to User document
      await axios.post(`${API_URL}/api/products/update-stock`, { items: cart });
      
      // Update local user state with new order
      const updatedUser = { ...user, orders: [newOrder, ...user.orders] };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setCart([]);
      setIsQRModalOpen(false);
      alert("🎉 Payment Verified! Order added to your history.");
    } catch (err) {
      alert("Verification failed. Please try again.");
    }
  };

  // --- Calculations ---
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- Conditional Rendering for Login ---
  if (!user) {
    return <LoginComponent onLogin={handleLoginData} API_URL={API_URL} />;
  }

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search premium collection..." 
            className="search-input" 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="nav-actions">
          <span className="user-welcome">Hello, {user.name}</span>
          <button className="logout-link" onClick={handleLogout}>Logout</button>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="cart-count">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
        </div>
      </nav>

      {/* Order History Section */}
      {user.orders && user.orders.length > 0 && (
        <div className="order-history-banner">
          <h3>Your Recent Orders</h3>
          <div className="orders-list">
            {user.orders.map((o, idx) => (
              <div key={idx} className="order-mini-card">
                <strong>{o.id}</strong> <br/> 
                <small>{o.date}</small> <br/> 
                <span>${o.total.toFixed(2)}</span>
                <div className="order-status">Processing</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="product-grid">
        {filteredProducts.map(p => (
          <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} />
        ))}
      </main>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        total={total} 
        onIncrease={addToCart}
        onDecrease={decreaseQuantity}
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