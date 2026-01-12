import React, { useEffect } from 'react';
import '../../styles/AddedToCartToast.css';

const AddedToCartToast = ({ itemName, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="added-toast">
      <div className="toast-border"></div>
      <div className="toast-text">
        <span className="gold-text">ADDED TO BAG</span>
        <p>{itemName}</p>
      </div>
    </div>
  );
};

export default AddedToCartToast;