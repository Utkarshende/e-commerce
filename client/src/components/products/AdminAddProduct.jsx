import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AdminAddProduct.css';

const AdminAddProduct = ({ API_URL, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Signature',
    image: '',
    backImage: '',
    stock: 10
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/api/products`, formData, {
        headers: { 'x-auth-token': token }
      });
      alert("✨ Masterpiece added to the collection.");
      // Reset form
      setFormData({ name: '', price: '', description: '', category: 'Signature', image: '', backImage: '', stock: 10 });
      onProductAdded();
    } catch (err) {
      alert("Error adding product. Check admin permissions.");
    }
  };

  return (
    <div className="admin-form-container">
      <h3>CURATE NEW ITEM</h3>
      <form onSubmit={handleSubmit} className="luxe-form">
        <div className="form-row">
          <input type="text" placeholder="PRODUCT NAME" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="number" placeholder="PRICE ($)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        </div>

        <textarea placeholder="STORY/DESCRIPTION" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
        
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
          <option value="Signature">SIGNATURE</option>
          <option value="Essentials">ESSENTIALS</option>
          <option value="Limited">LIMITED</option>
        </select>

        <div className="form-row">
          <input type="text" placeholder="PRIMARY IMAGE URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
          <input type="text" placeholder="SECONDARY IMAGE URL (HOVER)" value={formData.backImage} onChange={(e) => setFormData({...formData, backImage: e.target.value})} />
        </div>

        <input type="number" placeholder="INITIAL STOCK" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
        
        <button type="submit" className="admin-submit-btn">PUBLISH TO COLLECTION</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;