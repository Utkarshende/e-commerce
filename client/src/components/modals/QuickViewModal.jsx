import React from 'react';
import '../../styles/QuickViewModal.css';

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-content" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" onClick={onClose}>&times;</button>
        
        <div className="qv-body">
          {/* Image Gallery Side */}
          <div className="qv-images">
            <img src={product.image} alt={product.name} className="qv-main-img" />
            {product.backImage && (
              <img src={product.backImage} alt="Alternate view" className="qv-sub-img" />
            )}
          </div>

          {/* Details Side */}
          <div className="qv-details">
            <span className="qv-category">{product.category}</span>
            <h2 className="qv-title">{product.name}</h2>
            <p className="qv-price">${product.price}</p>
            
            <div className="qv-description">
              <p>Experience the pinnacle of craftsmanship. This piece from our {product.category} collection features premium materials and a silhouette designed for the modern connoisseur.</p>
            </div>

            <div className="qv-meta">
              <span>COMPLIMENTARY SHIPPING</span>
              <span>ESTIMATED DELIVERY: 2-4 DAYS</span>
            </div>

            <button 
              className="qv-add-btn" 
              onClick={() => { onAddToCart(product); onClose(); }}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "ADD TO BAG" : "SOLD OUT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;