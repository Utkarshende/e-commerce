import axios from 'axios';
import './CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems, total, clearCart }) => {
  if (!isOpen) return null;

  const handleCheckout = async () => {
    try {
      // Send the cart data to our new backend route
      const response = await axios.post('http://localhost:5000/api/checkout', {
        items: cartItems,
        total: total
      });

      if (response.data.success) {
        alert("🎉 Purchase Successful!");
        clearCart(); // Wipe the cart after buying
        onClose();   // Close the modal
      }
    } catch (err) {
      alert("Checkout failed. Is the server running?");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Your Cart ({cartItems.length})</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="cart-items-list">
          {cartItems.length === 0 ? <p>Your cart is empty.</p> : 
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))
          }
        </div>

        <div className="modal-footer">
          <h3>Total: ${total}</h3>
          <button 
            className="checkout-btn" 
            onClick={handleCheckout} 
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;