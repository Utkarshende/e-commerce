import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, total }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div 
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="cart-header">
              <span className="cart-title">YOUR SELECTION ({cartItems.length})</span>
              <button className="close-cart-btn" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart-msg">Your selection is currently empty.</div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item, idx) => (
                    <motion.div 
                      key={item._id}
                      className="cart-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <div className="item-img-wrapper">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <div className="item-main-info">
                          <p className="item-cat">{item.category}</p>
                          <h4 className="item-name">{item.name}</h4>
                        </div>
                        <div className="item-controls">
                          <div className="qty-selector">
                            <button onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}><FiMinus /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}><FiPlus /></button>
                          </div>
                          <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="cart-footer">
              <div className="total-row">
                <span>ESTIMATED TOTAL</span>
                <span className="total-amount">${total.toFixed(2)}</span>
              </div>
              <p className="shipping-note">Shipping & taxes calculated at checkout.</p>
              <button className="checkout-btn-luxury">
                PROCEED TO CHECKOUT
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;