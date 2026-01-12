import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-card-img" />
      </div>
      
      <div className="product-info">
        <span className="product-category">{product.category || 'Luxury'}</span>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-details-row">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
          <span className={`product-stock ${product.stock < 5 ? 'stock-low' : ''}`}>
            {isOutOfStock ? 'Sold Out' : `${product.stock} in stock`}
          </span>
        </div>

        <button 
          className="add-to-cart-btn" 
          onClick={onAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Notify Me' : 'Add to Collection'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;