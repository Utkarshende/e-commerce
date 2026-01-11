import axios from 'axios';
import './CartModal.css';
import { loadStripe } from '@stripe/stripe-js';

const CartModal = ({ isOpen, onClose, cartItems, total, clearCart }) => {
  if (!isOpen) return null;


const stripePromise = loadStripe('pk_test_your_publishable_key_here');

const handleCheckout = async () => {
    const stripe = await stripePromise;
    
    // Create the session on your backend
    const response = await axios.post('http://localhost:5000/api/products/create-checkout-session', {
        cartItems: cartItems
    });

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
    });

    if (result.error) {
        alert(result.error.message);
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