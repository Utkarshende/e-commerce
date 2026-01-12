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
      alert("✨ Product added to the collection.");
      setFormData({ name: '', price: '', description: '', category: 'Signature', image: '', stock: 10 });
      onProductAdded(); // Refresh the list
    } catch (err) {
      alert("Error adding product. Check admin permissions.");
    }
  };

  return (
    <div className="admin-form-container">
      <h3>Add New Masterpiece</h3>
      <form onSubmit={handleSubmit} className="luxe-form">
        <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="number" placeholder="Price (USD)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
        
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
          <option value="Signature">Signature</option>
          <option value="Essentials">Essentials</option>
          <option value="Limited">Limited</option>
        </select>

        <input type="text" placeholder="Image URL (Unsplash link)" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
        <input type="number" placeholder="Stock Quantity" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
        <input 
  type="text" 
  placeholder="Back Image URL (Optional)" 
  value={formData.backImage} 
  onChange={(e) => setFormData({...formData, backImage: e.target.value})} 
/>
        <button type="submit" className="admin-submit-btn">Publish to Store</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;