import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import './App.css';


const API_URL = "https://e-commerce-backend-pk30.onrender.com"; 


const socket = io(API_URL);
// --- CONFIGURATION END ---

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use the API_URL here instead of hardcoded localhost
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();

    socket.on('stockUpdate', (data) => {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === data.id ? { ...p, stock: data.newStock } : p
        )
      );
    });

    return () => socket.off('stockUpdate');
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const addToCart = (product) => setCart([...cart, product]);
  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
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
        {filteredProducts.length === 0 ? (
          <p>Connecting to Cloud Server...</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={() => addToCart(product)} 
            />
          ))
        )}
      </main>

      <CartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cartItems={cart}
        total={total}
        clearCart={clearCart}
      />
    </div>
  );
}

export default App;