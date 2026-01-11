import React from 'react';
import './CartModal.css'; 

const QRModal = ({ isOpen, onClose, total, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content text-center">
        <div className="modal-header">
          <h2>Payment Verification</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="qr-body" style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
            Amount to Pay: <strong style={{ color: '#d4af37' }}>${total.toFixed(2)}</strong>
          </p>
          
          <div className="qr-container" style={{ background: '#fff', padding: '15px', display: 'inline-block', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LuxeStorePayment" 
              alt="Scan to Pay" 
              style={{ width: '200px', height: '200px' }}
            />
          </div>

          <p style={{ marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
            Scan using any UPI app. Once the payment is complete, click the button below to verify your order.
          </p>
        </div>

        <div className="modal-footer">
          <button 
            className="checkout-btn" 
            style={{ width: '100%', background: '#000', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={onConfirm}
          >
            I Have Paid - Verify Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;