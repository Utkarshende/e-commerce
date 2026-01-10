import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NEW: State for filtering
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
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

  // Filter Logic: If 'All' is selected, show everything. Otherwise, filter by category.
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Get unique categories from the products list for the filter buttons
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

      {/* NEW: Filter Section */}
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
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onAddToCart={() => addToCart(product)} 
          />
        ))}
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