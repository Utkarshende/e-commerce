import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Styles
import './styles/App.css'; 

// Components
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import AddedToCartToast from './components/layout/AddedToCartToast';
import ProductCard from './components/products/ProductCard';
import LoginComponent from './pages/LoginComponent'; // Ensure path is correct

// Modals
import CartModal from './components/modals/CartModal';
import QRModal from './components/modals/QRModal';

const API_URL = "http://localhost:5000";

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

const moveToBag = (product) => {
  addToCart(product); // Use your existing addToCart function
  toggleWishlist(product); // Remove it from wishlist once moved
};

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  // --- INITIAL LOAD ---
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

  // --- AUTH ACTIONS ---
  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('luxe_cart');
    setUser(null);
    setCart([]);
    setIsCartOpen(false);
  };

  // --- CART ACTIONS ---
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
  const toggleWishlist = (product) => {
  setWishlist((prev) => {
    const isBookmarked = prev.find(item => item._id === product._id);
    if (isBookmarked) {
      return prev.filter(item => item._id !== product._id); // Remove
    }
    return [...prev, product]; // Add
  });
};

  const handleDecrease = (id) => {
    setCart(prev => {
      const item = prev.find(i => i._id === id);
      if (item.quantity === 1) return prev.filter(i => i._id !== id);
      return prev.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  // --- COMPUTED ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const cartTotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart]);

  // --- RENDER LOGIC ---
  return (
    <div className="app-container">
      {!user ? (
        /* SHOW LOGIN IF NO USER */
        <LoginComponent onLogin={handleLogin} API_URL={API_URL} />
      ) : (
        /* SHOW STORE IF USER LOGGED IN */
        <>
          <AddedToCartToast show={showToast} itemName={lastAddedItem} onClose={() => setShowToast(false)} />
          
          <Navbar 
            user={user} 
  cartCount={cartCount} 
  wishlistCount={wishlist.length}
  onCartClick={() => setIsCartOpen(true)}
  onWishlistClick={() => setIsWishlistOpen(true)} // You need to create this state
  onSearch={setSearchQuery}
  onLogout={handleLogout}
          />

          <main className="main-content">
            <CategoryBar activeCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={() => addToCart(product)}
                onToggleWishlist={toggleWishlist} // This is the function you created
    isWishlisted={wishlist.some(item => item._id === product._id)} />
              ))}
            </div>
          </main>

          <CartModal 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cartItems={cart} 
            total={cartTotal} 
            onIncrease={addToCart} 
            onDecrease={handleDecrease} 
            onCheckout={() => { setIsCartOpen(false); setIsQRModalOpen(true); }} 
          />

          <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} total={cartTotal} onConfirm={() => { alert("Order Placed!"); setCart([]); setIsQRModalOpen(false); }} />
        </>
      )}
    </div>
  );
}

export default App;