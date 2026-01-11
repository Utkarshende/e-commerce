import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import './App.css';
import QRModal from './QRModal'; // Don't forget to import!
// Replace with your actual Stripe Publishable Key
const stripePromise = loadStripe('pk_test_your_publishable_key_here');

// If testing locally, use http://localhost:5000. If deployed, use your Render URL.
const API_URL = "https://e-commerce-backend-pk30.onrender.com"; 
const socket = io(API_URL);

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  
  // States for Search and Filtering
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 1. Fetch initial products
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();

    const handleCheckout = () => {
  setIsModalOpen(false); // Close the cart
  setIsQRModalOpen(true); // Open the QR code
};

    // 2. Check for Stripe Success/Cancel URLs
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      alert("🎉 Payment Successful! Your order is being processed.");
      setCart([]); // Clear cart after success
    }
    if (query.get("canceled")) {
      alert("❌ Order canceled. Your cart is still saved.");
    }

    // 3. Real-time Socket listener for stock
    socket.on('stockUpdate', (data) => {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === data.id ? { ...p, stock: data.newStock } : p
        )
      );
    });

    return () => socket.off('stockUpdate');
  }, []);

  // --- Search and Category Logic ---
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  // --- Stripe Checkout Function ---
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      
      // Request a checkout session from your Backend
      const response = await axios.post(`${API_URL}/api/products/create-checkout-session`, {
        cartItems: cart
      });

      // Redirect to Stripe's secure payment page
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Failed to initiate checkout. Is your server running?");
    }
  };

  const addToCart = (product) => setCart([...cart, product]);
  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        
        {/* Live Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search premium products..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="cart-icon" onClick={() => setIsModalOpen(true)}>
          🛒 <span className="cart-count">{cart.length}</span>
        </div>
      </nav>

      <div className="filter-bar">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={() => addToCart(product)} 
            />
          ))
        ) : (
          <div className="no-results">
            No products found matching "{searchQuery}"
          </div>
        )}
      </main>

      <CartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cartItems={cart}
        total={total}
        onCheckout={handleCheckout} // Pass Stripe function to Modal
        clearCart={clearCart}
      />
      <QRModal 
  isOpen={isQRModalOpen} 
  onClose={() => setIsQRModalOpen(false)} 
  total={total}
  onConfirm={() => {
    alert("🎉 Payment Received! Your order is being processed.");
    setCart([]);
    setIsQRModalOpen(false);
  }}
/>
    </div>
  );
}

export default App;