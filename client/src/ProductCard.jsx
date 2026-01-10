import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} className="product-img" />
      <div className="card-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
        <button className="add-btn" onClick={onAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;