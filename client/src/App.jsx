import { useState } from 'react';
import ProductCard from './ProductCard';
import CartModal from './CartModal'; // Import the new modal
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if modal is open

  const products = [
    { id: 1, name: "iPhone 15", price: 999, image: "https://via.placeholder.com/150" },
    { id: 2, name: "MacBook Air", price: 1200, image: "https://via.placeholder.com/150" },
    { id: 3, name: "AirPods Pro", price: 250, image: "https://via.placeholder.com/150" },
  ];

  const addToCart = (product) => setCart([...cart, product]);

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">MySimpleShop</h1>
        {/* Click icon to open modal */}
        <div className="cart-icon" onClick={() => setIsModalOpen(true)}>
          🛒 <span className="cart-count">{cart.length}</span>
        </div>
      </nav>

      <main className="product-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={() => addToCart(product)} 
          />
        ))}
      </main>

      {/* The Modal Component */}
      <CartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cartItems={cart}
        total={total}
      />
    </div>
  );
}

export default App;