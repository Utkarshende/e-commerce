import React from 'react';
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
            placeholder="SEARCH THE COLLECTION..." 
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
        <button onClick={onLogout} className="nav-link">LOGOUT</button>
        <div className="cart-icon-container" onClick={onCartClick}>
          <span className="bag-text">BAG</span>
          <span className="cart-count">({cartCount})</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;