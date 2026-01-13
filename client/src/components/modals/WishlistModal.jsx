import React from 'react';
import './WishlistModal.css'; // Create this based on your CartModal style

const WishlistModal = ({ isOpen, onClose, wishlistItems, onMoveToBag, onRemove }) => {
  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>MY COLLECTION</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items-container">
          {wishlistItems.length === 0 ? (
            <p className="empty-msg">YOUR COLLECTION IS CURRENTLY EMPTY</p>
          ) : (
            wishlistItems.map(item => (
              <div key={item._id} className="bag-item">
                <img src={item.image} alt={item.name} className="bag-item-img" />
                <div className="bag-item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price}</p>
                  <div className="wishlist-actions">
                    <button className="move-to-bag-btn" onClick={() => onMoveToBag(item)}>
                      MOVE TO BAG
                    </button>
                    <button className="remove-wishlist-btn" onClick={() => onRemove(item)}>
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;