import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Styles
import './styles/App.css'; // Adjust path if your folder is named differently

// Layout Components
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import AddedToCartToast from './components/layout/AddedToCartToast';

// Product Components
import ProductCard from './components/products/ProductCard';
import AdminAddProduct from './components/products/AdminAddProduct';

// Modal Components
import CartModal from './components/modals/CartModal';
import QRModal from './components/modals/QRModal';

const API_URL = "http://localhost:5000";

function App() {
  // --- 1. CORE STATE ---
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- 2. UI CONTROL STATE ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  // --- 3. INITIALIZATION & PERSISTENCE ---
  useEffect(() => {
    fetchProducts();
    
    // Recovery: Load user and cart from storage
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const savedCart = JSON.parse(localStorage.getItem('luxe_cart'));
    
    if (savedUser) setUser(savedUser);
    if (savedCart) setCart(savedCart);
  }, []);

  // Sync cart to storage whenever it changes
  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  // Lock scroll when Bag is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'unset';
  }, [isCartOpen]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Connection to backend failed:", err);
    }
  };

  // --- 4. CART LOGIC ---
  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setLastAddedItem(product.name);
    setShowToast(true);

    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleDecrease = (productId) => {
    setCart(prev => {
      const item = prev.find(i => i._id === productId);
      if (!item) return prev;
      if (item.quantity === 1) {
        return prev.filter(i => i._id !== productId);
      }
      return prev.map(i => i._id === productId ? { ...i, quantity: i.quantity - 1 } : i);
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
      // Sync inventory with backend
      await Promise.all(cart.map(item => 
        axios.post(`${API_URL}/api/products/update-stock`, 
          { id: item._id, quantity: item.quantity },
          { headers: { 'x-auth-token': token } }
        )
      ));
      
      setCart([]);
      setIsQRModalOpen(false);
      alert("Order Placed Successfully.");
      fetchProducts(); // Refresh stock counts in UI
    } catch (err) {
      alert("Checkout failed. Please try again.");
    }
  };

  // --- 5. SEARCH & FILTERING LOGIC ---
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

  // --- 6. RENDER ---
  return (
    <div className="app-container">
      <AddedToCartToast 
        show={showToast} 
        itemName={lastAddedItem} 
        onClose={() => setShowToast(false)} 
      />

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
        {user?.isAdmin && (
          <AdminAddProduct API_URL={API_URL} onProductAdded={fetchProducts} />
        )}

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
                  if(window.confirm("Delete this product?")) {
                    await axios.delete(`${API_URL}/api/products/${id}`, {
                      headers: { 'x-auth-token': localStorage.getItem('token') }
                    });
                    fetchProducts();
                  }
                }}
              />
            ))
          ) : (
            <div className="empty-search-state">
              <p>NO ITEMS FOUND IN THIS COLLECTION</p>
            </div>
          )}
        </div>
      </main>

      {/* Cart Modal - Data logic passed here */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart} 
        total={cartTotal}
        onIncrease={addToCart}
        onDecrease={handleDecrease}
        onCheckout={handleCheckout}
      />

      {/* Payment Modal */}
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