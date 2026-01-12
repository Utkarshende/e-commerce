import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="simple-footer">
      <div className="footer-line"></div>
      <div className="footer-content">
        <div className="footer-brand">LUXE<span>STORE</span></div>
        
        <div className="footer-links">
          <span>Shop</span>
          <span>About</span>
          <span>Support</span>
        </div>

        <div className="footer-socials">
          <span title="Instagram">📸</span>
          <span title="Twitter">🐦</span>
          <span title="Pinterest">📌</span>
        </div>
      </div>
      <p className="copyright">Made with ✨ for a better shopping experience &copy; 2026</p>
    </footer>
  );
};

export default Footer;