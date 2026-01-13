import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="luxury-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2 className="logo-text">LUXE</h2>
          <p>Timeless elegance for the modern connoisseur.</p>
        </div>
        <div className="footer-section">
          <h4>COLLECTIONS</h4>
          <ul>
            <li>New Arrivals</li>
            <li>Limited Edition</li>
            <li>Accessories</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>ASSISTANCE</h4>
          <ul>
            <li>Shipping & Returns</li>
            <li>Contact Us</li>
            <li>Care Guide</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 LUXE ATELIER. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
};

export default Footer;