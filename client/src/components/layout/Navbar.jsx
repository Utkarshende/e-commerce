import React, { useState } from 'react';
import '../../styles/Navbar.css';

const Navbar = ({ user, cartCount, wishlistCount, onCartClick, onWishlistClick, onSearch, onLogout }) => {
  return (
    <nav className="luxury-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1 className="logo-text">LUXE</h1>
        </div>

        <div className="nav-actions">
          {user && (
            <div className="user-profile">
              <span className="welcome-msg">MEMBER: {user.name?.toUpperCase()}</span>
              <button className="nav-logout-btn" onClick={onLogout}>SIGNOUT</button>
            </div>
          )}

          <div className="nav-icons-group">
            {/* CLICKING THIS OPENS THE WISHLIST MODAL */}
            <div className="wishlist-trigger" onClick={onWishlistClick}>
              <span className="heart-icon-nav">{wishlistCount > 0 ? '♥' : '♡'}</span>
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </div>

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