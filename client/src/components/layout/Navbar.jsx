import React from 'react';
import '../../styles/Navbar.css';

const Navbar = ({ cartCount, onCartClick, user, onLogout, onSearch }) => {
  return (
    <nav className="luxe-navbar">
      <div className="nav-left">
        <input 
          type="text" 
          placeholder="SEARCH COLLECTION..." 
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="nav-center">
        <h1 className="logo">LUXE<span>STORE</span></h1>
      </div>

      <div className="nav-right">
        {user?.isAdmin && <span className="admin-tag">ADMIN</span>}
        <button onClick={onLogout} className="nav-link">LOGOUT</button>
        
        {/* This is the critical part for the Cart */}
        <div className="cart-icon-container" onClick={onCartClick}>
          <span className="bag-text">BAG</span>
          <span className="cart-count">({cartCount})</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;