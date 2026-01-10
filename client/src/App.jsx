import { useState, useEffect } from 'react'; // Added useEffect
import io from 'socket.io-client'; // Added socket
import axios from 'axios'; // Added axios
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import './App.css';

// Connect to the backend socket
const socket = io('http://localhost:5000');

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Now starts as empty array
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch products from backend database
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Could not fetch products", err);
      }
    };
    fetchProducts();

    // 2. Listen for Real-Time stock updates
    socket.on('stockUpdate', (data) => {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === data.id ? { ...p, stock: data.newStock } : p
        )
      );
    });

    // Clean up connection when app closes
    return () => socket.off('stockUpdate');
  }, []);

  const addToCart = (product) => setCart([...cart, product]);
  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">MySimpleShop</h1>
        <div className="cart-icon" onClick={() => setIsModalOpen(true)}>
          🛒 <span className="cart-count">{cart.length}</span>
        </div>
      </nav>

      <main className="product-grid">
        {products.map((product) => (
          <ProductCard 
            key={product._id} // Note: MongoDB uses _id, not id
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