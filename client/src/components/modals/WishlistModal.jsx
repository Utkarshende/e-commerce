import React from 'react';
import '../../styles/WishlistModal.css'; // Create this based on your CartModal style


const WishlistModal = ({ isOpen, onClose, wishlistItems, onMoveToBag, onRemove, onClearAll }) => {
  if (!isOpen) return null;

  const handleShare = () => {
    const names = wishlistItems.map(i => i.name).join(', ');
    navigator.clipboard.writeText(`Check out my Luxe Collection: ${names}`);
    alert("Collection details copied to clipboard!");
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="header-top">
            <h2>MY COLLECTION</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          {wishlistItems.length > 0 && (
            <button className="clear-all-link" onClick={onClearAll}>
              CLEAR ALL
            </button>
          )}
        </div>

        <div className="cart-items-container">
          {wishlistItems.length === 0 ? (
            <div className="empty-state">
              <p className="empty-msg">YOUR COLLECTION IS EMPTY</p>
              <button className="continue-btn" onClick={onClose}>BROWSE GALLERY</button>
            </div>
          ) : (
            <>
              {wishlistItems.map(item => (
                <div key={item._id} className="bag-item">
                  <img src={item.image} alt={item.name} className="bag-item-img" />
                  <div className="bag-item-info">
                    <h4>{item.name}</h4>
                    <p className="item-price">${item.price}</p>
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
              ))}
              <div className="wishlist-footer">
                <button className="share-collection-btn" onClick={handleShare}>
                  SHARE COLLECTION
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;