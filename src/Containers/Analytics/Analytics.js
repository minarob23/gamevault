
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Analytics.module.css';
import AnalyticsDashboard from '../../Components/Analytics/AnalyticsDashboard';

const Analytics = ({ allGames }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('admin-theme') || 'dark');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  return (
    <div className={styles.analyticsPage} data-theme={theme}>
      <div className={styles.header}>
        <h1 style={{ color: theme === 'light' ? '#000000' : '#ffffff' }}>Analytics Overview</h1>
        <div className={styles.headerButtons}>
          <button 
            className={styles.themeToggle} 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className={styles.separator}></div>
          <button 
            onClick={() => navigate('/game-ecommerce-store/admin')} 
            className={styles.backButton}
          >
            Back to Admin Panel
          </button>
        </div>
      </div>
      <div className={styles.dashboardWrapper}>
        <AnalyticsDashboard allGames={allGames} />
      </div>
    </div>
  );
};

export default Analytics;
