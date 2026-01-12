import React from 'react';
import '../../styles/CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems, total, onIncrease, onDecrease, onCheckout }) => {
  // If the modal isn't open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      {/* stopPropagation prevents clicking the white box from closing the modal */}
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        
        <div className="cart-header">
          <div className="header-spacer"></div>
          <h2>YOUR BAG</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items-container">
          {(!cartItems || cartItems.length === 0) ? (
            <div className="empty-bag-state">
              <p>THE COLLECTION IS CURRENTLY EMPTY</p>
              <button className="shop-now-btn" onClick={onClose}>CONTINUE BROWSING</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="bag-item">
                {/* Smaller, luxury-scaled image */}
                <div className="bag-item-img-wrapper">
                  <img src={item.image} alt={item.name} className="bag-item-img" />
                </div>

                <div className="bag-item-info">
                  <div className="info-header">
                    <h4>{item.name}</h4>
                    <p className="item-category">{item.category || "Signature"}</p>
                  </div>

                  <div className="info-actions">
                    {/* Larger, bold quantity controls */}
                    <div className="qty-picker">
                      <button onClick={() => onDecrease(item._id)} aria-label="Decrease quantity">−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button onClick={() => onIncrease(item)} aria-label="Increase quantity">+</button>
                    </div>
                    
                    <p className="bag-item-price-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span className="total-label">TOTAL AMOUNT</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>
            
            <button className="checkout-btn" onClick={onCheckout}>
              PROCEED TO CHECKOUT
            </button>
            
            <p className="shipping-note">Complimentary shipping on all luxury orders.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;