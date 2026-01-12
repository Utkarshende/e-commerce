import React from 'react';
import '../../styles/CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems, total, onIncrease, onDecrease, onCheckout }) => {
  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-panel">
        <div className="cart-header">
          <h2>YOUR BAG</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-msg">Your collection is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>${item.price}</p>
                  <div className="qty-controls">
                    <button onClick={() => onDecrease(item._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onIncrease(item)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>PROCEED TO CHECKOUT</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;