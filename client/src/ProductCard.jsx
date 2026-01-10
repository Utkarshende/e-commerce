import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="card">
      <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="product-img" />
      <div className="card-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
        <p className="stock">In Stock: {product.stock}</p> {/* Added stock display */}
        
        <button 
          className="add-btn" 
          onClick={onAddToCart}
          disabled={product.stock <= 0} // Disable button if stock is 0
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;