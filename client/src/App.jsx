import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import QRModal from './QRModal';
import './App.css';

const API_URL = "https://e-commerce-backend-pk30.onrender.com"; 
const socket = io(API_URL);

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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

  // --- Cart Logic (Quantity Handling) ---
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
      items: [...cart],
      total: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    };
    
    // Optional: Tell backend to reduce stock
    await axios.post(`${API_URL}/api/products/update-stock`, { items: cart });

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsQRModalOpen(false);
    alert("🎉 Order Verified! Thank you for shopping.");
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒 <span className="cart-count">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
        </div>
      </nav>

      {orders.length > 0 && (
        <div className="order-history-banner">
          <h3>My Orders</h3>
          <div className="orders-list">
            {orders.map(o => (
              <div key={o.id} className="order-mini-card">
                <strong>{o.id}</strong> <br/> {o.date} - ${o.total.toFixed(2)}
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

      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} total={total} onConfirm={confirmPayment} />
    </div>
  );
}

export default App;