import React from 'react';
import './CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems, total, onIncrease, onDecrease, onCheckout, clearCart }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? <p>Cart is empty</p> : cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>${item.price}</p>
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => onDecrease(item._id)}>-</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => onIncrease(item)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div className="modal-footer">
            <div className="total-section">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="action-buttons">
              <button className="clear-btn" onClick={clearCart}>Clear</button>
              <button className="checkout-btn" onClick={onCheckout}>Checkout with QR</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;