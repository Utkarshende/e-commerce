import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = ({ onClose }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '', stock: '' });
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Admin add token:', token);
      if (!token) {
        alert('You are not authenticated for admin actions. Please log out and log in again to obtain a token.');
        return;
      }
      await axios.post('http://localhost:5000/api/products', newProduct, { headers: { 'x-auth-token': token, Authorization: `Bearer ${token}` } });
      setNewProduct({ name: '', price: '', category: '', image: '', stock: '' });
      fetchProducts();
    } catch (err) {
      console.error("Error adding product", err);
      alert(err.response?.data?.message || 'Error adding product - see console');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this piece?")) {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: { 'x-auth-token': token } });
      fetchProducts();
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditData(product);
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/products/${id}`, editData, { headers: { 'x-auth-token': token } });
    setEditingId(null);
    fetchProducts();
  };

  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        <h2 className="admin-logo">LUXE<span>.ADM</span></h2>
        <ul className="admin-nav-links">
          <li className="active">INVENTORY</li>
          <li>ORDERS</li>
          <li>CUSTOMERS</li>
          <li className="nav-back"><a href="/">VIEW STORE</a></li>
        </ul>
      </nav>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Product Management</h1>
          {onClose && <button className="admin-back-btn" onClick={onClose}>Back to Store</button>}
          <div className="admin-stats">
            <div className="stat-card">Total Items: <span>{products.length}</span></div>
          </div>
        </header>

        <section className="admin-section card">
          <h3>Register New Inventory</h3>
          <form onSubmit={handleAddProduct} className="admin-create-form">
            <input type="text" placeholder="NAME" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
            <input type="number" placeholder="PRICE" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
            <input type="text" placeholder="CATEGORY" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} required />
            <input type="text" placeholder="IMAGE URL" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} required />
            <input type="number" placeholder="STOCK" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
            <button type="submit" className="admin-btn-primary">CREATE ENTRY</button>
          </form>
        </section>

        <section className="admin-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PREVIEW</th>
                <th>NAME</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className={editingId === p._id ? 'editing-row' : ''}>
                  <td><img src={p.image} alt="" className="admin-table-img" /></td>
                  {editingId === p._id ? (
                    <>
                      <td><input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} /></td>
                      <td><input type="text" value={editData.category} onChange={e => setEditData({...editData, category: e.target.value})} /></td>
                      <td><input type="number" value={editData.price} onChange={e => setEditData({...editData, price: e.target.value})} /></td>
                      <td><input type="number" value={editData.stock} onChange={e => setEditData({...editData, stock: e.target.value})} /></td>
                      <td>
                        <button onClick={() => handleUpdate(p._id)} className="btn-action save">SAVE</button>
                        <button onClick={() => setEditingId(null)} className="btn-action cancel">CANCEL</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>${p.price}</td>
                      <td className={p.stock < 5 ? 'low-stock' : ''}>{p.stock}</td>
                      <td>
                        <button onClick={() => startEdit(p)} className="btn-action edit">EDIT</button>
                        <button onClick={() => deleteProduct(p._id)} className="btn-action delete">DELETE</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;