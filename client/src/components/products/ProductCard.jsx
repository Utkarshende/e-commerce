import React from 'react';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onQuickView }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <button className={`wishlist-heart ${isWishlisted ? 'active' : ''}`} onClick={() => onToggleWishlist(product)}>
          {isWishlisted ? '♥' : '♡'}
        </button>
        <img src={product.image} alt={product.name} className="product-card-img primary" />
        <img src={product.backImage || product.image} alt={product.name} className="product-card-img secondary" />
        <div className="image-overlay-actions">
           <button className="view-details-btn" onClick={() => onQuickView(product)}>VIEW DETAILS</button>
        </div>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <button className="add-to-cart-btn" onClick={() => onAddToCart(product)} disabled={product.stock <= 0}>
          {product.stock > 0 ? 'ADD TO BAG' : 'SOLD OUT'}
        </button>
      </div>
    </div>
  );
};
export default ProductCard;