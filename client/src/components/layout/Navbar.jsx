import React, { useState } from 'react';
import '../../styles/Navbar.css';

const Navbar = ({ user, cartCount, wishlistCount, onCartClick, onWishlistClick, onProfileClick, onSearch, onLogout, onAdminClick }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const isAdmin = user?.email && (user.email === 'admin@luxe.com' || user.email.toLowerCase().includes('admin'));
  return (
    <nav className="luxury-navbar">
      <div className="nav-container">
        <div className="nav-brand"><h1 className="logo-text">LUXE</h1></div>
        <div className={`nav-search-container ${isSearchActive ? 'active' : ''}`}>
          <input type="text" placeholder="SEARCH..." onChange={(e) => onSearch(e.target.value)} onFocus={() => setIsSearchActive(true)} onBlur={() => setIsSearchActive(false)} />
        </div>
        <div className="nav-actions">
          <span className="welcome-msg clickable" onClick={onProfileClick}>MEMBER: {user.name?.toUpperCase()}</span>
          <div className="nav-icons-group">
            {isAdmin && <button className="nav-admin-btn" onClick={onAdminClick}>ADMIN</button>}
            <div className="wishlist-trigger" onClick={onWishlistClick}>
              <span>{wishlistCount > 0 ? '♥' : '♡'}</span>
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </div>
            <div className="nav-cart-trigger" onClick={onCartClick}>
              <span className="cart-label">BAG ({cartCount})</span>
            </div>
            <button className="nav-logout-btn" onClick={onLogout}>EXIT</button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;