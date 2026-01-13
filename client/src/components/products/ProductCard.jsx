import React from 'react';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onQuickView }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        {/* Visible Wishlist Heart */}
        <button 
          className={`wishlist-icon-btn ${isWishlisted ? 'active' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>

        {/* Hover Image Swap */}
        <img src={product.image} alt={product.name} className="product-card-img primary" />
        <img src={product.backImage || product.image} alt={product.name} className="product-card-img secondary" />
        
        <div className="image-overlay-actions">
          <button className="view-details-btn" onClick={() => onQuickView(product)}>
            QUICK VIEW
          </button>
        </div>
      </div>

      <div className="product-info">
        <div>
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
        </div>
        <p className="product-price">${product.price}</p>
        <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
          ADD TO BAG
        </button>
      </div>
    </div>
  );
};

export default ProductCard;