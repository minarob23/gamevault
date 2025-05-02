import React, { useState } from 'react';
import styles from './Payment.module.css';

const Payment = ({ total = 0, cart = [] }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !expiryDate || !cvv) {
      alert('Please fill in all payment details');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setTimeout(() => {
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowRating(true);
      }, 1000);
    }, 1500);
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      setShowValidationModal(true);
      setTimeout(() => setShowValidationModal(false), 3000);
      return;
    }

    // Create feedback entry with timestamp
    const timestamp = new Date().toLocaleString();
    const feedbackEntry = `[${timestamp}] - ${feedback.trim()}\n`;
    
    try {
      // Store feedback in localStorage
      const existingFeedback = localStorage.getItem('userFeedback') || '';
      localStorage.setItem('userFeedback', existingFeedback + feedbackEntry);

      // Store feedback in localStorage only
      
      setShowSuccessMessage(true);
      setFeedback('');
      setTimeout(() => {
        window.location.href = '/game-ecommerce-store';
      }, 2000);
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback. Please try again.');
    }
  };


  return (
    <div className={styles.payment}>
      {!paymentSuccess ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Payment Details</h2>
          <div className={styles.cartSummary}>
            <h3>Items to Purchase:</h3>
            {cart && cart.length > 0 ? cart.map((game) => (
              <div key={game.id} className={styles.cartItem}>
                <img src={game.cover} alt={game.name} className={styles.gameImage} />
                <span>{game.name}</span>
                <span className={styles.price}>${game.price}</span>
                <span className={`${styles.stock} ${game.inCart ? styles.inStock : styles.outOfStock}`}>
                  {game.inCart ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            )) : <p>No items in cart</p>}
            <div className={styles.totalAmount}>
              <h3>Total Amount: ${total.toFixed(2)}</h3>
            </div>
          </div>
          <div className={styles.cardTypes}>
            <h3 className={styles.paymentTitle}>Secure Payment Gateway</h3>
            <div className={styles.secureIcons}>🔒 💳</div>
          </div>
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength="16"
            required
          />
          <div className={styles.cardDetails}>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              maxLength="5"
              required
            />
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength="3"
              required
            />
          </div>
          <button type="submit">Pay ${total.toFixed(2)}</button>
        </form>
      ) : showRating ? (
        <div className={styles.feedback}>
          <h2>Share Your Feedback</h2>
          <textarea
            className={styles.feedbackInput}
            placeholder="Write your comments and recommendations..."
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            className={styles.submitButton}
            onClick={handleFeedbackSubmit}
          >
            Submit Feedback
          </button>
          {showValidationModal && (
            <div className={styles.modalOverlay}>
              <div className={`${styles.feedbackModal} ${styles.validationModal}`}>
                <h2>Feedback Required</h2>
                <p>Please share your thoughts with us before submitting.</p>
                <p>Your feedback is valuable!</p>
                <button 
                  className={styles.closeModalButton}
                  onClick={() => setShowValidationModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {showSuccessMessage && (
            <div className={styles.modalOverlay}>
              <div className={styles.feedbackModal}>
                <h2>Thank You!</h2>
                <p>Your feedback has been submitted successfully.</p>
                <p>We appreciate your input!</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.success}>
          <h1 className={styles.successTitle}>Payment Successful!</h1>
          <p className={styles.thankYou}>Thank you for your purchase</p>
        </div>
      )}
    </div>
  );
};

export default Payment;