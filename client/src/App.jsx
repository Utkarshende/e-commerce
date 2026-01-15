import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './styles/App.css';

import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import ProductCard from './components/products/ProductCard';
import LoginComponent from './auth/LoginComponent';
import OrderHistory from './components/profile/OrderHistory';
import Footer from './components/layout/Footer';
import AdminDashboard from './components/admin/AdminDashboard';

// Modals
import CartModal from './components/modals/CartModal';
import QRModal from './components/modals/QRModal';
import WishlistModal from './components/modals/WishlistModal';
import QuickViewModal from './components/modals/QuickViewModal';
import CartDrawer from './components/layout/CartDrawer';

const API_URL = "http://localhost:5000";

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedQuickView, setSelectedQuickView] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedWishlist = localStorage.getItem('luxe_wishlist');
    const savedOrders = localStorage.getItem('luxe_orders');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('luxe_orders', JSON.stringify(orders));
  }, [wishlist, orders]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || p.category === selectedCategory)
    ));
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="app-container">
      {!user ? (
        <LoginComponent onLogin={(data) => {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.token) localStorage.setItem('token', data.token);
        }} API_URL={API_URL} />
      ) : (    <>
          {isAdminOpen ? (
            <AdminDashboard onClose={() => setIsAdminOpen(false)} />
          ) : (
            <>
          <Navbar 
            user={user} 
            cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
            wishlistCount={wishlist.length}
            onCartClick={() => setIsCartOpen(true)} 
            onWishlistClick={() => setIsWishlistOpen(true)}
            onProfileClick={() => setIsHistoryOpen(true)}
            onSearch={setSearchQuery} 
            onLogout={() => { localStorage.clear(); setUser(null); }} 
            onAdminClick={() => setIsAdminOpen(true)}/>
          <main className="main-content">
            <CategoryBar activeCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            <div className="product-grid">
              {filteredProducts.map(p => (
                <ProductCard 
                  key={p._id} product={p} 
                  onAddToCart={addToCart} 
                  onQuickView={setSelectedQuickView}
                  isWishlisted={wishlist.some(i => i._id === p._id)}
                  onToggleWishlist={(prod) => setWishlist(prev => prev.find(i => i._id === prod._id) ? prev.filter(i => i._id !== prod._id) : [...prev, prod])}
                />
              ))}
            </div>
          </main>
          <Footer />
          {/* Modals */}
          {isHistoryOpen && <OrderHistory orders={orders} onClose={() => setIsHistoryOpen(false)} />}
<CartDrawer 
  isOpen={isCartOpen} 
  onClose={() => setIsCartOpen(false)} 
  cartItems={cart}
  onUpdateQuantity={(id, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: newQty } : item));
  }}
  onRemove={(id) => setCart(prev => prev.filter(item => item._id !== id))}
  total={cart.reduce((acc, i) => acc + (i.price * i.quantity), 0)}/>
          <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistItems={wishlist} onMoveToBag={(p) => {addToCart(p); setWishlist(prev => prev.filter(i => i._id !== p._id));}} onRemove={(p) => setWishlist(prev => prev.filter(i => i._id !== p._id))} />
          <QuickViewModal product={selectedQuickView} isOpen={!!selectedQuickView} onClose={() => setSelectedQuickView(null)} onAddToCart={addToCart} />
          <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} total={cart.reduce((acc, i) => acc + (i.price * i.quantity), 0)} onConfirm={() => {setOrders(prev => [{orderId: Date.now(), items: [...cart], total: 100}, ...prev]); setCart([]); setIsQRModalOpen(false);}} />
            </>
          )}
        </>
      )}
    </div>
  );
}


export default App;