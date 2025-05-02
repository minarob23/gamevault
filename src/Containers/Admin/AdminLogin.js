
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';

import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('AuthToken', 'admin-token');
      setError('');
      const successMsg = document.createElement('div');
      successMsg.className = styles.successToast;
      successMsg.textContent = 'Login successful!';
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
        navigate('/game-ecommerce-store/admin');
      }, 1500);
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <motion.div 
      className={styles.adminLogin} 
      data-theme={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.themeContainer}>
        <button 
          className={styles.themeToggle}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <motion.div 
        className={styles.loginBox}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
      >
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;
