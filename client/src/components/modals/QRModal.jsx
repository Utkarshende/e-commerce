import React from 'react';
import '../../styles/QRModal.css';

const QRModal = ({ isOpen, onClose, total = 0, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content qr-content">
        <div className="modal-header">
          <h2>Scan to Pay</h2>  
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="qr-body">
          <p>Please scan the QR code below to complete your payment.</p>
          
          <div className="total-display">
            Amount to Pay: <strong>${(Number(total) || 0).toFixed(2)}</strong>
          </div>

          <div className="qr-placeholder">
            {/* Replace this URL with your actual payment QR image or a generator link */}
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Pay_${total}`} 
              alt="Payment QR Code" 
              className="qr-img"
            />
          </div>

          <p className="instruction">Once paid, click "Confirm Payment" below.</p>
        </div>

        <div className="modal-footer">
          <button className="confirm-btn" onClick={onConfirm}>Confirm Payment</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;