import React from 'react';
import '../../styles/OrderHistory.css';

const OrderHistory = ({ orders, onClose }) => {
  return (
    <div className="history-overlay">
      <div className="history-panel">
        <div className="history-header">
          <button className="back-btn" onClick={onClose}>← BACK TO SHOP</button>
          <h2 className="logo-text">MY ORDERS</h2>
        </div>

        <div className="history-list">
          {orders.length === 0 ? (
            <div className="empty-history">
              <p>NO PURSUITS YET.</p>
              <span className="gold-link" onClick={onClose}>START YOUR COLLECTION</span>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.orderId} className="order-row">
                <div className="order-meta">
                  <span className="order-number">REF: {order.orderId}</span>
                  <span className="order-date">{order.date}</span>
                </div>
                
                <div className="order-items-preview">
                  {order.items.map((item, idx) => (
                    <span key={idx}>{item.name}{idx < order.items.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>

                <div className="order-footer">
                  <span className="order-status">STATUS: DISPATCHED</span>
                  <span className="order-price">TOTAL: ${order.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;