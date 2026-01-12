import React, { useEffect, useState } from 'react';
import '../../styles/WelcomeToast.css';

const WelcomeToast = ({ userName }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after a tiny delay
    const showTimeout = setTimeout(() => setVisible(true), 500);
    // Hide after 4 seconds
    const hideTimeout = setTimeout(() => setVisible(false), 4500);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="welcome-toast">
      <div className="toast-content">
        <span className="toast-icon">✨</span>
        <p>Welcome back, <span className="user-name">{userName}</span>. The collection is ready.</p>
      </div>
      <div className="toast-progress"></div>
    </div>
  );
};

export default WelcomeToast;