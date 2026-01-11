import React from 'react';
import './CartModal.css'; // We can reuse the modal styling

const QRModal = ({ isOpen, onClose, total, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content qr-content">
        <div className="modal-header">
          <h2>Scan to Pay</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="qr-body">
          <p className="total-label">Amount to Pay: <strong>${total.toFixed(2)}</strong></p>
          
          {/* Sample QR Code */}
          <div className="qr-frame">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LuxeStoreSample" 
              alt="Payment QR Code" 
            />
          </div>

          <p className="qr-instructions">
            Please scan the QR code using your banking app to complete the transaction.
          </p>
        </div>

        <div className="modal-footer">
          <button className="checkout-btn" onClick={onConfirm}>
            I Have Paid
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;