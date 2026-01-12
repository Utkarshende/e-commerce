import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="luxe-footer">
      <div className="footer-top">
        <div className="footer-brand-section">
          <h2 className="footer-logo">LUXE<span>STORE</span></h2>
          <p className="footer-tagline">Curating excellence for the modern minimalist.</p>
        </div>
        
        <div className="footer-nav">
          <div className="footer-column">
            <h5>Exploration</h5>
            <p>Signature</p>
            <p>Essentials</p>
            <p>Limited</p>
          </div>
          <div className="footer-column">
            <h5>Client Care</h5>
            <p>Shipping</p>
            <p>Returns</p>
            <p>Contact</p>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <div className="social-links">
          <span>INSTAGRAM</span>
          <span>PINTEREST</span>
        </div>
        <p className="copyright-text">© 2026 LUXE STORE — PRIVATE COLLECTION</p>
      </div>
    </footer>
  );
};

export default Footer;