import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import './App.css';


const API_URL = "https://e-commerce-backend-pk30.onrender.com/";

const socket = io(API_URL);

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NEW: State for Search and Filter
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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

  // --- REFINED FILTER LOGIC ---
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const addToCart = (product) => setCart([...cart, product]);
  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">LUXE STORE</h1>
        
        {/* NEW: Search Bar Input */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search products..." 
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
          <div className="no-results">No products found matching "{searchQuery}"</div>
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