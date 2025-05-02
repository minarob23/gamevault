import React, { useState } from 'react';
import LoginModal from './LoginModal';
import styles from './Home.module.css';
import NavBar from '../../Components/NavBar/NavBar';
import { ReactComponent as GitHubLogo } from "../../Resources/image/githublogo.svg";
import { ReactComponent as Enter } from "../../Resources/image/enter.svg";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Cart from '../../Components/Cart/Cart';

const Home = props => {
  const {
    cartAmount,
    cart,
    cartDisplayed,
    handleOpenCart,
    handleCloseCart,
    clearCart,
    handleRemoveFromCart,
    hoverState,
    setHoverState,
    overlap,
    setOverlap,
    openGamePage
  } = props;

  const [browsing, setBrowsing] = useState(false);
  const [landingPage] = useState(true);

  const navigate = useNavigate();

  const handleHover = (e) => {
    const buttonId = e.target.id;
    if(hoverState[buttonId]){
        setHoverState({
            ...hoverState,
            [buttonId]: { hovered: !hoverState[buttonId].hovered }
        });
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = () => {
    window.localStorage.setItem("LoginUser", "true");
    setIsModalOpen(false);
  };

  const requireLogin = (isAdmin = false) => {
    setIsModalOpen(true);
    setIsAdminLogin(isAdmin);
    return false;
  };

  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleBrowse = () => {
    if (!window.localStorage.getItem("LoginUser")) {
      requireLogin();
      return;
    }
    setOverlap(true);
    setTimeout(() => {
      setBrowsing(true);
      navigate('/game-ecommerce-store-main/browse');
    }, 1500);
  };

  const handleHome = () => {
    if (!window.localStorage.getItem("LoginUser")) {
      requireLogin();
      return;
    }
    setBrowsing(false);
    navigate('/');
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 900 },
    visible: { opacity: 1, y: 0, transition: {  y: { type: "tween", duration: 1.5, bounce: 0.3 }} },
  };


  return (
    <div className={styles.main}>
      {overlap ? 
          <motion.div 
            className={styles.overlap}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
          </motion.div> 
      : null}

      {cartDisplayed ? <Cart 
              cartDisplayed={cartDisplayed} 
              handleOpenCart={handleOpenCart}
              handleCloseCart={handleCloseCart}
              cart={cart}
              cartAmount={cartAmount}
              handleHover={handleHover}
              hoverState={hoverState}
              clearCart={clearCart}
              handleRemoveFromCart={handleRemoveFromCart}
              openGamePage={openGamePage}
      /> : null}

      <div className={styles.home}>        
        {isModalOpen && (
          <LoginModal onClose={handleCloseModal} onLogin={handleLogin} isAdminLogin={isAdminLogin} />
        )}

        <video autoPlay muted loop className={styles.video}>
          <source src={require("../../Resources/image/pyke.mp4")} type="video/mp4" />
        </video>

        <NavBar 
          handleHover={handleHover} 
          hoverState={hoverState}
          browsing={browsing}
          handleBrowse={handleBrowse}
          handleHome={handleHome}
          landingPage={landingPage}
          cartAmount={cartAmount}
          handleOpenCart={handleOpenCart}
          handleCloseCart={handleCloseCart}
          requireLogin={requireLogin}
        />

        <div className={styles.container}>
          <div className={styles.center}>
            <motion.div 
              className={styles.splash}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >Game Vault</motion.h1>
              <motion.p 
                className={styles.intro}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Find the latest and greatest games at unbeatable prices. Benefit from round-the-clock support, 
                exclusive deals, and a seamless buying experience. Got feedback? Connect with us or check out career openings!
              </motion.p>
            </motion.div>

            <motion.div 
              className={styles.buttons}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.button 
                id="0"
                className={`${styles.cta} ${styles.browseBtn}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                setIsModalOpen(true);
                setIsAdminLogin(false);
              }} aria-label="Browse"
              onMouseOver={handleHover}
              >
                <Enter className={styles.ctaSVG} />
                Browse
              </motion.button>
              <a href="https://github.com/minarob23" target="_blank" rel="noopener noreferrer">
                <motion.button 
                  id="1"
                  className={styles.cta}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View Repository"
                  onMouseOver={handleHover}
                >
                  <GitHubLogo className={styles.ctaSVG} />
                  GitHub
                </motion.button>
              </a>
              <motion.button 
                id="21"
                className={`${styles.cta} ${styles.whiteText}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsModalOpen(true);
                  setIsAdminLogin(true);
                }} 
                aria-label="Admin Panel"
                onMouseOver={handleHover}
              >
                <img src={require("../../Resources/image/adminpanellogo.svg").default} alt="Admin" className={styles.ctaSVG} style={{ width: '32px', height: '32px', filter: 'invert(0)' }} />
                <span>Admin Panel</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;