import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/LoginComponent.css';

const LoginComponent = ({ onLogin, API_URL }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      // Pass data back to App.jsx.
      onLogin(res.data); 
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-auth-wrapper">
      {/* Left Section: Cinematic Visual */}
      <div className="auth-visual-side">
        <div className="overlay-gradient"></div>
        <img 
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974" 
          alt="Luxury Editorial" 
          className="ken-burns-animation"
        />
        <div className="brand-signature">
          <h1>LUXE</h1>
          <p>ESTABLISHED MMXXIV</p>
        </div>
      </div>
a
      {/* Right Section: Refined Form */}
      <div className="auth-form-side">
        <div className="form-content-reveal">
          <header className="auth-header">
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to access the collection.</p>
          </header>

          <form onSubmit={handleSubmit} className="luxury-input-group">
            <div className="floating-input">
              <input 
                type="email" 
                placeholder=" " 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <label>Email Address</label>
            </div>

            <div className="floating-input">
              <input 
                type="password" 
                placeholder=" " 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <label>Password</label>
            </div>

            <button type="submit" className="luxury-submit-btn" disabled={loading}>
              {loading ? "AUTHENTICATING..." : "ENTER STORE"}
            </button>
          </form>

          <footer className="auth-helper-text">
            <p>Secure encryption enabled for private collections.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;