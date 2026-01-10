import './CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems, total }) => {
  if (!isOpen) return null; // Don't show anything if not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Your Cart ({cartItems.length})</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))
          )}
        </div>

        <div className="modal-footer">
          <h3>Total: ${total}</h3>
          <button className="checkout-btn" disabled={cartItems.length === 0}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;