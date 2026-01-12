import React from 'react';
import '../../styles/CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems, total, onIncrease, onDecrease, onCheckout }) => {
  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="spacer"></div>
          <h2>YOUR BAG</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items-container">
          {(!cartItems || cartItems.length === 0) ? (
            <div className="empty-bag">
              <p>THE COLLECTION IS EMPTY</p>
              <button onClick={onClose} className="continue-shop">CONTINUE BROWSING</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="bag-item">
                <div className="bag-item-img-box">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="bag-item-info">
                  <div className="info-top">
                    <h4>{item.name}</h4>
                    <p className="price">${item.price}</p>
                  </div>
                  
                  <div className="info-bottom">
                    <div className="qty-picker">
                      <button onClick={() => onDecrease(item._id)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onIncrease(item)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="subtotal">
              <span>SUBTOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;