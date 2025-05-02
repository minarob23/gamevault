import React, { useState, useEffect } from 'react';
import styles from './Chatbot.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import sendIcon from '../../Resources/image/send.svg';
import chatbotIcon from '../../Resources/image/chatbot_logo.svg';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameRecommendations] = useState([
    'Recommend me some action games under $30',
    'What are the best RPG games with good storylines?',
    'Show me popular racing games',
    'Which strategy games have the highest ratings?',
    'Recommend sports games released recently',
    'What are the most popular puzzle games?',
    'Show games similar to Cyberpunk 2077',
    'What are the top-rated FPS games?',
    'Suggest games with good reviews'
  ]);
  const [error, setError] = useState('');
  const API_KEY = localStorage.getItem('openrouter-api-key');

  useEffect(() => {
    const initChatbot = () => {
      const token = localStorage.getItem('auth-token');
    };
    initChatbot();
  }, []);

  const generateResponse = async (userMessage) => {
    setIsLoading(true);
    setError('');

    if (!API_KEY) {
      setError('Chatbot is not configured. Please contact admin to set up API key.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Game Vault Assistant'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [
            {
              role: 'system',
              content: 'You are a knowledgeable gaming assistant who helps users find and learn about video games. Provide specific game recommendations based on user preferences and queries.'
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok || !data.choices || !data.choices.length) {
        throw new Error('Invalid response from API');
      }
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error);
      return 'I apologize, but I encountered an error. Please try again.';
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');

    try {
      const response = await generateResponse(userMessage);
      if (response) {
        setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      } else if (error) {
        setMessages(prev => [...prev, { text: error, sender: 'bot', isError: true }]);
      }
    } catch (err) {
      const errorMessage = 'Failed to generate response. Please try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot', isError: true }]);
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.chatbot}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <img src={chatbotIcon} alt="Chatbot" className={styles.chatbotIcon} />
              <h3>Game Vault Assistant</h3>
            </div>
            <button onClick={onClose} className={styles.closeButton}>×</button>
          </div>

          <div className={styles.container}>
            <div className={styles.chat}>
              <div className={styles.messages}>
                {error && (
                  <div className={styles.errorMessage}>
                    <p>{error}</p>
                  </div>
                )}
                {!error && messages.length === 0 && (
                  <div className={styles.welcomeMessage}>
                    <p>Hello! I'm your Game Vault Assistant. How can I help you today?</p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx} 
                    className={`${styles.message} ${styles[msg.sender]} ${msg.isError ? styles.error : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.messageText}>
                      {msg.text.replace(/#{1,6}\s/g, '').replace(/\*\*/g, '').replace(/\*/g, '')}
                    </div>
                  </motion.div>
                ))}
                {isLoading && <div className={styles.loadingMessage}>AI is typing</div>}
              </div>
              <form onSubmit={handleSubmit} className={styles.inputForm}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className={styles.chatInput}
                />
                <button type="submit" className={styles.sendButton}>
                  <img src={sendIcon} alt="Send" />
                </button>
              </form>
            </div>

            <div className={styles.recommendations}>
              <h4>Game Recommendations</h4>
              <div className={styles.recommendationGrid}>
                {gameRecommendations.map((rec, idx) => (
                  <motion.div
                    key={rec}
                    className={styles.recommendationChip}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => {
                      setInput(rec);
                      handleSubmit({ preventDefault: () => {} });
                    }}
                  >
                    {rec}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;