import React from 'react';
import '../../styles/CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems = [], total = 0, onIncrease, onDecrease, onCheckout, clearCart }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content cart-organized">
        <div className="modal-header">
          <h2>Your Selection</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <p>Your collection is empty.</p>
              <button className="continue-btn" onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-row">
                    <img src={item.image} alt={item.name} className="cart-img-small" />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="unit-price">${(Number(item.price) || 0).toFixed(2)}</p>
                    </div>
                    <div className="cart-controls">
                      <button onClick={() => onDecrease(item._id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onIncrease(item)}>+</button>
                    </div>
                    <div className="cart-subtotal">
                      ${((Number(item.price) || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>${(Number(total) || 0).toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping</span>
                  <span className="free-tag">Complimentary</span>
                </div>
                <div className="summary-line total-line">
                  <strong>Total</strong>
                  <strong>${(Number(total) || 0).toFixed(2)}</strong>
                </div>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="modal-actions">
            <button className="secondary-btn" onClick={clearCart}>Empty Cart</button>
            <button className="primary-btn" onClick={onCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;