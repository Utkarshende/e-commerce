import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Components
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import AddedToCartToast from './components/layout/AddedToCartToast';
import ProductCard from './components/products/ProductCard';
import LoginComponent from './pages/LoginComponent';

// Modals
import CartModal from './components/modals/CartModal';
import QRModal from './components/modals/QRModal';
import WishlistModal from './components/modals/WishlistModal';
import QuickViewModal from './components/modals/QuickViewModal';

const API_URL = "http://localhost:5000";

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedQuickView, setSelectedQuickView] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  
  // Feedback UI
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Backend Error:", err);
    }
  };

  // --- Auth Actions ---
  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  // --- Cart Actions ---
  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setLastAddedItem(product.name);
    setShowToast(true);
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleDecrease = (id) => {
    setCart(prev => {
      const item = prev.find(i => i._id === id);
      if (item.quantity === 1) return prev.filter(i => i._id !== id);
      return prev.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  // --- Wishlist Actions ---
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) return prev.filter(item => item._id !== product._id);
      return [...prev, product];
    });
  };

  const moveToBagFromWishlist = (product) => {
    addToCart(product);
    toggleWishlist(product);
  };

  // --- Computed Values ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const cartTotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart]);

  return (
    <div className="app-container">
      {!user ? (
        <LoginComponent onLogin={handleLogin} API_URL={API_URL} />
      ) : (
        <>
          <AddedToCartToast show={showToast} itemName={lastAddedItem} onClose={() => setShowToast(false)} />
          
          <Navbar 
            user={user} 
            cartCount={cartCount} 
            wishlistCount={wishlist.length}
            onCartClick={() => setIsCartOpen(true)} 
            onWishlistClick={() => setIsWishlistOpen(true)}
            onSearch={setSearchQuery}
            onLogout={handleLogout} 
          />

          <main className="main-content">
            <CategoryBar activeCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={() => addToCart(product)} 
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.some(i => i._id === product._id)}
                  onQuickView={(p) => setSelectedQuickView(p)}
                />
              ))}
            </div>
          </main>

          {/* All Luxury Modals */}
          <CartModal 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cartItems={cart} 
            total={cartTotal} 
            onIncrease={addToCart} 
            onDecrease={handleDecrease} 
            onCheckout={() => { setIsCartOpen(false); setIsQRModalOpen(true); }} 
          />

          <WishlistModal 
            isOpen={isWishlistOpen} 
            onClose={() => setIsWishlistOpen(false)} 
            wishlistItems={wishlist}
            onMoveToBag={moveToBagFromWishlist}
            onRemove={toggleWishlist}
          />

          <QuickViewModal 
            product={selectedQuickView} 
            isOpen={!!selectedQuickView} 
            onClose={() => setSelectedQuickView(null)} 
            onAddToCart={addToCart} 
          />

          <QRModal 
            isOpen={isQRModalOpen} 
            onClose={() => setIsQRModalOpen(false)} 
            total={cartTotal} 
            onConfirm={() => { alert("Order Placed!"); setCart([]); setIsQRModalOpen(false); }} 
          />
        </>
      )}
    </div>
  );
}

export default App;