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
        <img src={product.image} alt={product.name} className="product-card-img" />
      </div>

      <div className="product-info-overlay">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-price">${product.price}</span>
        
        {product.stock > 0 ? (
          <button className="add-to-cart-btn" onClick={onAddToCart}>
            Add to Bag
          </button>
        ) : (
          <button className="add-to-cart-btn sold-out" disabled>
            Sold Out
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;