import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BackToTop from './components/layout/BackToTop';
import WelcomeToast from './components/layout/WelcomeToast';

// Products
import ProductCard from './components/products/ProductCard';
import Spinner from './components/products/Spinner';
import AdminAddProduct from './components/products/AdminAddProduct';

// Modals
import CartModal from './components/modals/CartModal';
import QRModal from './components/modals/QRModal';

// Auth & Style
import LoginComponent from './pages/LoginComponent';
import './styles/App.css';

const API_URL = "https://e-commerce-backend-pk30.onrender.com";
const socket = io(API_URL);

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  // Inside your App component
const [lastAddedItem, setLastAddedItem] = useState(null); // Fixes the second error
const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setCart([]);
  }, []);

  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products`, { headers: { 'x-auth-token': token } });
      setProducts(res.data);
    } catch (err) { if (err.response?.status === 401) handleLogout(); }
    finally { setTimeout(() => setLoading(false), 800); }
  }, [handleLogout]);

  useEffect(() => {
    if (user) fetchProducts();
    
    socket.on('stockUpdate', (data) => {
      setProducts(prev => prev.map(p => p._id === data.id ? { ...p, stock: data.newStock } : p));
    });

    socket.on('newProductAdded', (newProduct) => {
      setProducts(prev => [newProduct, ...prev]);
    });

    socket.on('productDeleted', (productId) => {
      setProducts(prev => prev.filter(p => p._id !== productId));
    });

    return () => {
      socket.off('stockUpdate');
      socket.off('newProductAdded');
      socket.off('productDeleted');
    };
  }, [user, fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this piece from the collection?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, { headers: { 'x-auth-token': token } });
      // The socket listener 'productDeleted' will handle the UI update
    } catch (err) { alert("Failed to delete product."); }
  };

const addToCart = (product) => {
  // 1. Show the luxury toast
  setLastAddedItem(product.name); 
  setShowToast(true);

  // 2. Update the cart state
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
  
  // Luxury Toast Logic
  setLastAddedItem(product.name);
  setShowToast(true);
};

  const cartTotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (!user) return <LoginComponent onLogin={(d) => { localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d.user)); setUser(d.user); }} API_URL={API_URL} />;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // 1. Function to decrease quantity or remove item
const handleDecrease = (productId) => {
  setCart(prevCart => {
    const existingItem = prevCart.find(item => item._id === productId);
    
    if (existingItem.quantity === 1) {
      // Remove item entirely if quantity hits 0
      return prevCart.filter(item => item._id !== productId);
    } else {
      // Decrease quantity by 1
      return prevCart.map(item =>
        item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    }
  });
};

// Add this function inside your App component
const handleCheckout = () => {
  if (cart.length === 0) {
    alert("Your bag is empty.");
    return;
  }
  setIsCartOpen(false); // Close the Bag
  setIsQRModalOpen(true); // Open the Payment Modal
};


  // Add this function inside your App component before the return
const handleConfirmPayment = async () => {
  const token = localStorage.getItem('token');
  try {
    // 1. Update stock for all items in cart
    await Promise.all(cart.map(item => 
      axios.post(`${API_URL}/api/products/update-stock`, { 
        id: item._id, 
        quantity: item.quantity 
      }, { headers: { 'x-auth-token': token } })
    ));

    // 2. Clear Local State
    setCart([]);
    setIsQRModalOpen(false);
    
    // 3. Success Feedback
    alert("Transaction Confirmed. Your masterpiece is being prepared.");
  } catch (err) {
    console.error("Payment Error:", err);
    alert("Payment processing failed. Please check your connection.");
  }
}


  return (
    <div className="app-wrapper">
      {user && <WelcomeToast userName={user.name} />}
      <Navbar scrolled={scrolled} user={user} cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} onLogout={handleLogout} onSearch={setSearchQuery} />
      
      {user.isAdmin && <AdminAddProduct API_URL={API_URL} onProductAdded={fetchProducts} />}

      <div className="category-bar">
        {['All', 'Signature', 'Essentials', 'Limited'].map(cat => (
          <button key={cat} className={`cat-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
        ))}
      </div>

      <main className="container main-content">
        {loading ? <Spinner /> : (
          <div className="product-grid">
            {filteredProducts.map(p => (
              <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} isAdmin={user.isAdmin} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BackToTop />
<CartModal 
  isOpen={isCartOpen} 
  onClose={() => setIsCartOpen(false)} 
  cartItems={cart}        // <--- CRITICAL: Must match your [cart] state
  total={cartTotal} 
  onIncrease={addToCart} 
  onDecrease={handleDecrease} 
  onCheckout={handleCheckout} 
/><QRModal 
  isOpen={isQRModalOpen} 
  onClose={() => setIsQRModalOpen(false)} 
  total={cartTotal} 
  onConfirm={handleConfirmPayment} 
  onCheckout={handleCheckout} // <-- Ensure this is linked!
/>    </div>
  );

export default App;