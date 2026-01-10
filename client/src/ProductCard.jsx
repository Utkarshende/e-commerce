import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  console.log("Product Data Check:", product); // This will show you the data in the browser console

  return (
    <div className="card">
      <span className="category-tag">{product.category}</span>
      <img src={product.image} alt={product.name} className="product-img" />
      
      <div className="card-info">
        <h3>{product.name}</h3>
        
        {/* We use a fallback text here to see if the property is missing */}
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