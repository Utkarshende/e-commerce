import React from 'react';
import './CartModal.css';

const CartModal = ({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  total = 0, 
  onIncrease, 
  onDecrease, 
  onCheckout, 
  clearCart 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart-container">
              <p>Your cart is currently empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="cart-item-img" 
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  {/* Safety check for item price */}
                  <p className="item-price">
                    ${(Number(item.price) || 0).toFixed(2)}
                  </p>
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => onDecrease(item._id)}
                    >
                      -
                    </button>
                    <span className="qty-num">{item.quantity || 1}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => onIncrease(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="modal-footer">
            <div className="total-section">
              <span>Total Amount:</span>
              {/* Safety check for total to prevent .toFixed crash */}
              <span className="total-price">
                ${(Number(total) || 0).toFixed(2)}
              </span>
            </div>
            <div className="action-buttons">
              <button className="clear-btn" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="checkout-btn" onClick={onCheckout}>
                Checkout with QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;