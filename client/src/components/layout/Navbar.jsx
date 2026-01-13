import React, { useState } from 'react';
import '../../styles/Navbar.css';

const Navbar = ({ user, cartCount, onCartClick, onSearch, onLogout, wishlistCount, onWishlistClick }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <nav className="luxury-navbar">
      <div className="nav-container">
        {/* Left Side: Brand Identity */}
        <div className="nav-brand">
          <h1 className="logo-text">LUXE</h1>
        </div>

        {/* Center: Search Experience */}
        <div className={`nav-search-container ${isSearchActive ? 'active' : ''}`}>
          <input 
            type="text" 
            placeholder="SEARCH COLLECTION..." 
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setIsSearchActive(false)}
          />
          <span className="search-icon">⌕</span>
        </div>

        {/* Right Side: Actions */}
        <div className="nav-actions">
          {user && (
            <div className="user-profile">
              <span className="welcome-msg">MEMBER: {user.name?.toUpperCase()}</span>
              <button className="nav-logout-btn" onClick={onLogout}>
                SIGNOUT
              </button>
            </div>
          )}

          <div className="nav-icons-group">
            {/* Wishlist Trigger */}
            <div className="wishlist-trigger" onClick={onWishlistClick}>
              <span className="heart-icon">{wishlistCount > 0 ? '♥' : '♡'}</span>
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </div>

            {/* Bag Trigger */}
            <div className="nav-cart-trigger" onClick={onCartClick}>
              <span className="cart-label">BAG</span>
              <span className="cart-badge">{cartCount}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;