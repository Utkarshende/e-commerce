import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="luxe-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-logo">LUXE<span>STORE</span></h3>
          <p>Defining modern elegance through curated luxury essentials.</p>
        </div>
        
        <div className="footer-section">
          <h4>Collection</h4>
          <ul>
            <li>New Arrivals</li>
            <li>Limited Edition</li>
            <li>Accessories</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Assistance</h4>
          <ul>
            <li>Shipping Policy</li>
            <li>Returns & Exchanges</li>
            <li>Contact Concierge</li>
          </ul>
        </div>

        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <span>Instagram</span>
            <span>Pinterest</span>
            <span>Twitter</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 LUXE STORE. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;