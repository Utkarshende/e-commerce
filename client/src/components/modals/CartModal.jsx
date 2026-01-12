import React from 'react';
import '../../styles/CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems, total, onIncrease, onDecrease, onCheckout }) => {
  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
       <div className="cart-header">
  <button className="invisible-spacer" disabled style={{ opacity: 0 }}>&times;</button>
  <h2>YOUR BAG</h2>
  <button className="close-btn" onClick={onClose}>&times;</button>
</div>

        {/* Scrollable Area */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-msg">Your bag is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price}</p>
                  <div className="qty-box">
                    <button onClick={() => onDecrease(item._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onIncrease(item)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fixed Bottom Area */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total-display">
              <span>TOTAL AMOUNT</span>
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