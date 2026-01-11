import { useState } from 'react';
import axios from 'axios';

const LoginComponent = ({ onLogin, API_URL }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post(`${API_URL}/api/auth/register`, formData);
        alert("Registration successful! Please login.");
        setIsRegister(false);
      } else {
        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        onLogin(res.data); // Pass user data back to App.jsx
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input 
              type="text" placeholder="Full Name" required 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          )}
          <input 
            type="email" placeholder="Email Address" required 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            type="password" placeholder="Password" required 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <button type="submit" className="auth-btn">
            {isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p onClick={() => setIsRegister(!isRegister)} className="toggle-auth">
          {isRegister ? "Already have an account? Sign In" : "New here? Create an account"}
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;