import axios from 'axios';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const buy = () => axios.post(`http://localhost:5000/api/buy/${product._id}`);

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Items left: <strong>{product.stock}</strong></p>
      <button 
        onClick={buy} 
        disabled={product.stock <= 0}
        className={product.stock <= 0 ? "buy-btn out-of-stock" : "buy-btn"}
      >
        {product.stock > 0 ? "Buy Now" : "Sold Out"}
      </button>
    </div>
  );
}