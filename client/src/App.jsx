import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import ProductCard from './components/products/ProductCard';
import AdminAddProduct from './components/products/AdminAddProduct';
import CartModal from './components/modals/CartModal';
import QRModal from './components/modals/QRModal';
import AddedToCartToast from './components/layout/AddedToCartToast';
import './styles/App.css';
const API_URL = "http://localhost:5000"; // Ensure this matches your backend

function App() {
  // --- States ---
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  // --- Initial Loads ---
  useEffect(() => {
    fetchProducts();
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const savedCart = JSON.parse(localStorage.getItem('luxe_cart'));
    if (savedUser) setUser(savedUser);
    if (savedCart) setCart(savedCart);
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
      console.error("Error fetching products:", err);
    }
  };

const addToCart = (product) => {
  setCart(prev => {
    const existing = prev.find(item => item._id === product._id);
    if (existing) {
      return prev.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    // Make sure we spread all product properties + add quantity
    return [...prev, { ...product, quantity: 1 }];
  });
};

  const handleDecrease = (productId) => {
    setCart(prev => {
      const item = prev.find(i => i._id === productId);
      if (item.quantity === 1) {
        return prev.filter(i => i._id !== productId);
      }
      return prev.map(i => i._id === productId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Your bag is empty");
    setIsCartOpen(false);
    setIsQRModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    const token = localStorage.getItem('token');
    try {
      // Update stock for each item in the backend
      await Promise.all(cart.map(item => 
        axios.post(`${API_URL}/api/products/update-stock`, 
          { id: item._id, quantity: item.quantity },
          { headers: { 'x-auth-token': token } }
        )
      ));
      setCart([]);
      setIsQRModalOpen(false);
      alert("Purchase successful. Thank you for choosing LUXE.");
      fetchProducts(); // Refresh stock in UI
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
  };

  // --- Filtering & Totals ---
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="app-container">
      <AddedToCartToast 
        show={showToast} 
        itemName={lastAddedItem} 
        onClose={() => setShowToast(false)} 
      />

      <Navbar 
        user={user} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        onLogout={handleLogout}
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
          {filteredProducts.map(product => (
            <ProductCard 
              key={product._id}
              product={product}
              isAdmin={user?.isAdmin}
              onAddToCart={() => addToCart(product)}
              onDelete={async (id) => {
                await axios.delete(`${API_URL}/api/products/${id}`, {
                  headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                fetchProducts();
              }}
            />
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