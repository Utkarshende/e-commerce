import React from 'react';
import '../../styles/Navbar.css';

const Navbar = ({ scrolled, cartCount, onCartClick, onLogout, user, onSearch }) => {
  return (
    <nav className={`luxe-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">LUXE<span>STORE</span></div>
        
        <div className="nav-search">
          <input 
            type="text" 
            placeholder="Search our collection..." 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="nav-tools">
          <span className="user-welcome">Hello, {user?.name || 'Guest'}</span>
          
          <div className="cart-trigger" onClick={onCartClick}>
            <span className="cart-label">Bag</span>
            <div className="cart-badge-container">
              <span className="bag-icon">👜</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </div>
          </div>

          <button className="nav-logout" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;