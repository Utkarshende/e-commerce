import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  console.log("Product Data Check:", product); 
  return (
    <div className="card">
      <span className="category-tag">{product.category}</span>
      <img src={product.image} alt={product.name} className="product-img" />
      
      <div className="card-info">
        <h3>{product.name}</h3>
        
        <p className="description">
          {product.description || "Data missing from database"}
        </p>
        
        <div className="card-footer">
          <span className="price">${product.price}</span>
          <button className="add-btn" onClick={onAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;