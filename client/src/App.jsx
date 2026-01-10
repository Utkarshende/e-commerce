
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import './App.css';

// Connect to the backend socket server
const socket = io('http://localhost:5000');

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Load data and setup real-time listeners
  useEffect(() => {
    // Fetch products from the database on startup
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();

    // Listen for real-time stock updates from the server
    socket.on('stockUpdate', (data) => {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === data.id ? { ...p, stock: data.newStock } : p
        )
      );
    });

    // Cleanup connection when the component unmounts
    return () => socket.off('stockUpdate');
  }, []);

  // 2. Load cart from LocalStorage so items don't disappear on refresh
  useEffect(() => {
    const savedCart = localStorage.getItem('my_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // 3. Save cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('my_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('my_cart');
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 className="logo">MySimpleShop</h1>
        <div className="cart-icon" onClick={() => setIsModalOpen(true)}>
          🛒 <span className="cart-count">{cart.length}</span>
        </div>
      </nav>

      {/* Product Display Grid */}
      <main className="product-grid">
        {products.length === 0 ? (
          <p>Connecting to database... please wait.</p>
        ) : (
          products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={() => addToCart(product)} 
            />
          ))
        )}
      </main>

      {/* Cart Modal Pop-up */}
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