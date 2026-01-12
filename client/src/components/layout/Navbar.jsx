import React from 'react';
import { useState } from 'react';
import '../../styles/Navbar.css';


const Navbar = ({ cartCount, onCartClick, user, onLogout, onSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className={`luxe-navbar ${isSearchFocused ? 'search-active' : ''}`}>
      <div className="nav-left">
        <div className={`search-wrapper ${isSearchFocused ? 'expanded' : ''}`}>
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="SEARCH..." 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="nav-center">
        <h1 className="logo">LUXE<span>STORE</span></h1>
      </div>

      <div className="nav-right">
        {/* Standard User/Logout Action */}
        <div className="user-actions">
          <span className="user-name">{user?.name?.split(' ')[0]}</span>
          <button onClick={onLogout} className="logout-icon-btn" title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
        
        {/* Standard Bag Button */}
        <button className="bag-button" onClick={onCartClick}>
          <div className="bag-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {cartCount > 0 && <span className="bag-badge">{cartCount}</span>}
          </div>
          <span className="bag-label">BAG</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;