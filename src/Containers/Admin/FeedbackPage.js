
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FeedbackPage.module.css';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState(localStorage.getItem('admin-theme') || 'dark');
  
  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);
  const [feedback, setFeedback] = React.useState(
    localStorage.getItem('userFeedback')?.split('\n').filter(Boolean) || []
  );

  const handleDelete = (index) => {
    const updatedFeedback = feedback.filter((_, i) => i !== index);
    localStorage.setItem('userFeedback', updatedFeedback.join('\n'));
    setFeedback(updatedFeedback);
  };

  const handleDeleteAll = () => {
    localStorage.setItem('userFeedback', '');
    setFeedback([]);
  };

  return (
    <div className={styles.feedbackPage}>
      <div className={styles.header}>
        <h1>User Feedback</h1>
        <div className={styles.buttonGroup}>
          {feedback.length > 0 && (
            <button 
              className={styles.deleteAllButton}
              onClick={handleDeleteAll}
            >
              Delete All Feedback
            </button>
          )}
          <button
            className={styles.refreshButtonCircle}
            onClick={() => window.location.reload()}
          >
            <img 
              src={require(`../../Resources/image/${theme === 'light' ? 'black_refresh.svg' : 'white_refresh.svg'}`)} 
              alt="Refresh" 
              className={styles.refreshIcon} 
            />
          </button>
          <button 
            className={styles.themeToggle}
            onClick={() => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              localStorage.setItem('admin-theme', newTheme);
              setTheme(newTheme);
              document.body.setAttribute('data-theme', newTheme);
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/game-ecommerce-store/admin')}
          >
            Back to Admin Panel
          </button>
        </div>
      </div>
      <div className={styles.feedbackList}>
        {feedback.length > 0 ? (
          feedback.map((feedbackItem, index) => {
            const [timestamp, ...messageParts] = feedbackItem.split('] - ');
            const message = messageParts.join('] - ');
            const date = new Date(timestamp.replace('[', ''));
            
            const formattedDate = date.toLocaleDateString('en-US', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });
            
            const formattedTime = date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
            
            return (
              <div key={index} className={styles.feedbackItem}>
                <div className={styles.feedbackContent}>
                  <div className={styles.feedbackTime}>
                    <span className={styles.feedbackDate}>{formattedDate}</span>
                    <span className={styles.feedbackTimeText}>{formattedTime}</span>
                  </div>
                  <div className={styles.feedbackMessage}>
                    {message}
                  </div>
                </div>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            );
          })
        ) : (
          <p className={styles.noFeedback}>No feedback submitted yet</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
