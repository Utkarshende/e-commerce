import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Layout & Components
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import AddedToCartToast from './components/layout/AddedToCartToast';
import ProductCard from './components/products/ProductCard';

// Modals
import CartModal from './components/modals/CartModal';
import QRModal from './components/modals/QRModal';

import './styles/App.css';

const API_URL = "http://localhost:5000";

function App() {
  // --- 1. STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]); // This is our 'Source of Truth'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  // --- 2. DATA PERSISTENCE & LOADING ---
  useEffect(() => {
    fetchProducts();
    
    // Load existing session data
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const savedCart = JSON.parse(localStorage.getItem('luxe_cart'));
    
    if (savedUser) setUser(savedUser);
    if (savedCart) setCart(savedCart || []);
  }, []);

  // Save Cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // --- 3. CART ACTIONS ---
  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setLastAddedItem(product.name);
    setShowToast(true);

    setCart(prevCart => {
      const existing = prevCart.find(item => item._id === product._id);
      if (existing) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleDecrease = (productId) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i._id === productId);
      if (!existing) return prevCart;
      
      if (existing.quantity === 1) {
        return prevCart.filter(i => i._id !== productId);
      }
      return prevCart.map(i => i._id === productId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsQRModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    const token = localStorage.getItem('token');
    try {
      // Update inventory on backend
      await Promise.all(cart.map(item => 
        axios.post(`${API_URL}/api/products/update-stock`, 
          { id: item._id, quantity: item.quantity },
          { headers: { 'x-auth-token': token } }
        )
      ));
      
      setCart([]); // Clear cart after successful payment
      setIsQRModalOpen(false);
      alert("Payment Confirmed. Your order is being prepared.");
      fetchProducts(); // Refresh stock counts
    } catch (err) {
      alert("Payment processing error. Please contact support.");
    }
  };

  // --- 4. COMPUTED VALUES (PERFORMANCE) ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // --- 5. RENDER ---
  return (
    <div className="app-container">
      {/* Notifications */}
      <AddedToCartToast 
        show={showToast} 
        itemName={lastAddedItem} 
        onClose={() => setShowToast(false)} 
      />

      {/* Navigation */}
      <Navbar 
        user={user} 
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        onLogout={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />

      <main className="main-content">
        <CategoryBar 
          activeCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory} 
        />

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product._id}
                product={product}
                isAdmin={user?.isAdmin}
                onAddToCart={() => addToCart(product)}
                onDelete={async (id) => {
                  if(window.confirm("Delete this item?")) {
                    await axios.delete(`${API_URL}/api/products/${id}`, {
                      headers: { 'x-auth-token': localStorage.getItem('token') }
                    });
                    fetchProducts();
                  }
                }}
              />
            ))
          ) : (
            <div className="no-results">NO ITEMS FOUND IN THIS COLLECTION</div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}        /* Corrected: passing 'cart' state */
        total={cartTotal}
        onIncrease={addToCart}
        onDecrease={handleDecrease}
        onCheckout={handleCheckout}
      />

      <QRModal 
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        total={cartTotal}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}

export default App;