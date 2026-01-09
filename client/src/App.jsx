import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ProductCard from './ProductCard';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load initial data
    axios.get('http://localhost:5000/api/products').then(res => setProducts(res.data));

    // Listen for real-time stock changes
    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => 
        p._id === data.id ? { ...p, stock: data.newStock } : p
      ));
    });

    return () => socket.off('stockUpdate');
  }, []);

  return (
    <div className="shop-container">
      <h1>Simple Real-Time Store</h1>
      <div className="grid">
        {products.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}

export default App;