import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Components
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import AddedToCartToast from './components/layout/AddedToCartToast';
import ProductCard from './components/products/ProductCard';
import LoginComponent from './pages/LoginComponent';
import OrderHistory from './components/profile/OrderHistory';

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
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedQuickView, setSelectedQuickView] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  // Persistence: Load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedWishlist = localStorage.getItem('luxe_wishlist');
    const savedOrders = localStorage.getItem('luxe_orders');
    
    if (savedUser && savedToken) setUser(JSON.parse(savedUser));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    fetchProducts();
  }, []);

  // Persistence: Save
  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('luxe_orders', JSON.stringify(orders));
  }, [wishlist, orders]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) { console.error("Backend Error:", err); }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCart([]);
    setOrders([]);
    setIsHistoryOpen(false);
  };

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

  const completeOrder = () => {
    const newOrder = {
      orderId: `LX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: [...cart],
      total: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0)
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsQRModalOpen(false);
    alert("TRANSACTION VERIFIED.");
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="app-container">
      {!user ? (
        <LoginComponent onLogin={(data) => {setUser(data.user); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user));}} API_URL={API_URL} />
      ) : (
        <>
          <Navbar 
            user={user} cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
            wishlistCount={wishlist.length}
            onCartClick={() => setIsCartOpen(true)} 
            onWishlistClick={() => setIsWishlistOpen(true)}
            onProfileClick={() => setIsHistoryOpen(true)}
            onSearch={setSearchQuery} onLogout={handleLogout} 
          />
          <main className="main-content">
            <CategoryBar activeCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            <div className="product-grid">
              {filteredProducts.map(p => (
                <ProductCard key={p._id} product={p} onAddToCart={addToCart} onQuickView={setSelectedQuickView}
                  onToggleWishlist={(prod) => setWishlist(prev => prev.find(i => i._id === prod._id) ? prev.filter(i => i._id !== prod._id) : [...prev, prod])}
                  isWishlisted={wishlist.some(i => i._id === p._id)} />
              ))}
            </div>
          </main>
          {isHistoryOpen && <OrderHistory orders={orders} onClose={() => setIsHistoryOpen(false)} />}
          <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} total={cart.reduce((acc, i) => acc + (i.price * i.quantity), 0)} onCheckout={() => {setIsCartOpen(false); setIsQRModalOpen(true);}} />
          <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistItems={wishlist} onMoveToBag={(p) => {addToCart(p); setWishlist(prev => prev.filter(i => i._id !== p._id));}} onRemove={(p) => setWishlist(prev => prev.filter(i => i._id !== p._id))} />
          <QuickViewModal product={selectedQuickView} isOpen={!!selectedQuickView} onClose={() => setSelectedQuickView(null)} onAddToCart={addToCart} />
          <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} total={cart.reduce((acc, i) => acc + (i.price * i.quantity), 0)} onConfirm={completeOrder} />
        </>
      )}
    </div>
  );
}

export default App;