import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal'; // NEW
import './App.css';

const API_URL = "https://e-commerce-backend-pk30.onrender.com"; 
const socket = io(API_URL);

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]); // NEW: Order History State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) { console.error(err); }
    };
    fetchProducts();

    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => p._id === data.id ? { ...p, stock: data.newStock } : p));
    });
    return () => socket.off('stockUpdate');
  }, []);

  // --- Logic Functions ---
  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsQRModalOpen(true);
  };

  const confirmPayment = () => {
    // Save to Order History
    const newOrder = {
      id: `#LUXE-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      items: [...cart],
      total: cart.reduce((sum, i) => sum + i.price, 0)
    };
    
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsQRModalOpen(false);
    alert("🎉 Order Verified! Check your 'My Orders' section.");
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        <input 
          type="text" 
          placeholder="Search..." 
          className="search-input" 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒 <span>{cart.length}</span>
        </div>
      </nav>

      {/* NEW: Order History Section */}
      {orders.length > 0 && (
        <div className="order-history-banner">
          <h3>My Orders ({orders.length})</h3>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-mini-card">
                <span>{order.id}</span> | <span>${order.total}</span> | <span className="status-tag">Processing</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="product-grid">
        {filteredProducts.map(p => (
          <ProductCard key={p._id} product={p} onAddToCart={() => setCart([...cart, p])} />
        ))}
      </main>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        total={total} 
        onCheckout={handleCheckoutClick} // Changed to open QR
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