import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  
  // High-end fallback: if the database image fails, use this generic "Luxe" placeholder
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=500&auto=format&fit=crop"; 
  };

  return (
    <div className="card">
      <span className="category-tag">{product.category}</span>
      
      <img 
        src={product.image} 
        alt={product.name} 
        className="product-img" 
        onError={handleImageError} // This is the professional magic line
      />
      
      <div className="card-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        
        <div className="card-footer">
          <span className="price">${product.price}</span>
          <span className="stock-label">Stock: {product.stock}</span>
        </div>
        
        <button 
          className="add-btn" 
          onClick={onAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;