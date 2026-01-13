import React from 'react';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, index, onAddToCart, onToggleWishlist, isWishlisted }) => {
  // Format index as 00, 01, 02
  const displayIndex = index < 10 ? `0${index}` : index;

  return (
    <div className="index-product-row">
      {/* Number and Name */}
      <div className="product-main-link">
        <span className="product-index">{displayIndex}.</span>
        <h3 className="product-title-text">{product.name.toUpperCase()}</h3>
      </div>

      {/* The Hover Image - This only shows on hover of the row */}
      <div className="hover-image-container">
        <img src={product.image} alt={product.name} className="index-hover-img" />
      </div>

      {/* Right Side Actions */}
      <div className="product-meta-actions">
        <span className="product-price-index">${product.price}</span>
        <button 
          className={`wishlist-heart-minimal ${isWishlisted ? 'active' : ''}`} 
          onClick={() => onToggleWishlist(product)}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
        <button className="add-bag-minimal" onClick={() => onAddToCart(product)}>
          ADD TO BAG
        </button>
      </div>
    </div>
  );
};

export default ProductCard;