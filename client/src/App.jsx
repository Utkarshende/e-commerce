import { useState } from 'react';
import ProductCard from './ProductCard';
import './App.css';

function App() {
  // This state tracks items added to the cart
  const [cart, setCart] = useState([]);

  // Mock data for our products (since we are doing frontend first)
  const products = [
    { id: 1, name: "iPhone 15", price: 999, image: "https://via.placeholder.com/150" },
    { id: 2, name: "MacBook Air", price: 1200, image: "https://via.placeholder.com/150" },
    { id: 3, name: "AirPods Pro", price: 250, image: "https://via.placeholder.com/150" },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 className="logo">MySimpleShop</h1>
        <div className="cart-icon">
          🛒 <span className="cart-count">{cart.length}</span>
        </div>
      </nav>

      {/* Product Display */}
      <main className="product-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={() => addToCart(product)} 
          />
        ))}
      </main>
    </div>
  );
}

export default App;