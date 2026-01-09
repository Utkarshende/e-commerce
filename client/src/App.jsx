import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import './App.css';

// Connect to the backend socket
const socket = io('http://localhost:5000');

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 1. Fetch initial products from the API
    const fetchProducts = async () => {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    };
    fetchProducts();

    // 2. Real-time Listener
    socket.on('stockUpdate', (updatedItem) => {
      // Find the product in our state and update its stock
      setProducts((currentProducts) =>
        currentProducts.map((p) =>
          p._id === updatedItem.id ? { ...p, stock: updatedItem.newStock } : p
        )
      );
    });

    // Cleanup when component closes
    return () => socket.off('stockUpdate');
  }, []);

  return (
    <div className="container">
      <h1>Simple Real-Time Shop</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default App;