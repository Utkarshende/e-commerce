import React from 'react';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, isAdmin, onDelete }) => {
  return (
    <div className="product-card">
      {isAdmin && (
        <button className="admin-delete-badge" onClick={() => onDelete(product._id)}>
          Delete
        </button>
      )}
      
      <div className="product-image-container">
        {/* Main Image */}
        <img src={product.image} alt={product.name} className="product-card-img primary" />
        
        {/* Secondary Image (Swap) - Fallback to primary if backImage doesn't exist */}
        <img 
          src={product.backImage || product.image} 
          alt={`${product.name} view 2`} 
          className="product-card-img secondary" 
        />
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        
        <div className="product-details-row">
  {product.stock > 0 ? (
    <span className={`product-stock ${product.stock <= 3 ? 'stock-low' : ''}`}>
      {product.stock <= 3 ? `Only ${product.stock} Remaining` : `In Stock: ${product.stock}`}
    </span>
  ) : (
    <span className="product-stock sold-out-text">Currently Unavailable</span>
  )}
</div>

        <button 
          className="add-to-cart-btn" 
          onClick={onAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Bag' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;