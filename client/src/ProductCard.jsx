import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="card">
      <span className="category-tag">{product.category}</span>
      <img src={product.image} alt={product.name} className="product-img" />
      
      <div className="card-info">
        <h3>{product.name}</h3>
        
        {/* Check this line carefully! It must match the schema name exactly */}
        <p className="description">
          {product.description ? product.description : "Loading description..."}
        </p>
        
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