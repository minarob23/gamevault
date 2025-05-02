import styles from './Browse.module.css';
import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Grid from '../../Components/Grid/Grid';
import Filters from '../../Components/Filters/Filters';
import Cart from '../../Components/Cart/Cart';
import AnimatedPage from '../AnimatedPage/AnimatedPage';
import Footer from '../../Components/Footer/Footer';
import Chatbot from '../../Components/Chatbot/Chatbot';
import chatbotLogo from '../../Resources/image/chatbot_logo.png';

export default function Browse({ 
  handleHover, 
  hoverState = [], 
  handleHome, 
  cart = [],
  cartAmount = 0,
  cartDisplayed = false,
  handleOpenCart,
  handleCloseCart,
  clearCart,
  handleAddToCart,
  handleLike,
  handleHoverGame,
  handleSelectGame,
  browsing = false,
  search = "",
  searching = false,
  handleSearch,
  handleSearchSubmit,
  handleBrowse,
  handleRemoveFromCart,
  setHoverState,
  openGamePage
}) {

  const [activeFilter, setActiveFilter] = useState("All");
  const [activeView, setActiveView] = useState("grid");
  const [activeSorting, setActiveSorting] = useState("None");

  useEffect(() => {
    // Set browsing state when component mounts
    if (!browsing) {
      handleBrowse();
    }
  }, [browsing, handleBrowse]); // Add dependencies to prevent infinite loop

  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <section className={styles.Browse} style={{ maxHeight: cartDisplayed ? "100vh" : "1000vh", minHeight: "100vh" }}>
        {cartDisplayed ? 
          <Cart 
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

        <NavBar
          handleHover={handleHover}
          hoverState={hoverState}
          handleHome={handleHome}
          browsing={browsing}
          cartAmount={cartAmount}
          search={search}
          searching={searching}
          handleSearch={handleSearch}
          handleSearchSubmit={handleSearchSubmit}
          handleOpenCart={handleOpenCart}
          handleCloseCart={handleCloseCart}
        />

        <AnimatedPage exitBeforeEnter>
            <div className={styles.browseContent}>
              <Filters 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                activeView={activeView}
                setActiveView={setActiveView}
                activeSorting={activeSorting}
                setActiveSorting={setActiveSorting}
                hoverState={hoverState || {}}
                handleHover={handleHover}
                handleSelect={handleSelectGame}
                currentFilter={activeFilter}
              />

              <div className={styles.list}>
                <h1>Popular and Engaging</h1>
                <p>Based on player counts and ratings</p>

                <Grid 
                  activeFilter={activeFilter}
                  activeView={activeView}
                  activeSorting={activeSorting}
                  handleHoverGame={handleHoverGame}
                  handleSelectGame={handleSelectGame}
                  handleAddToCart={handleAddToCart}
                  handleLike={handleLike}
                  setHoverState={setHoverState}
                  openGamePage={openGamePage}
                />
              </div>
            </div>
        </AnimatedPage>
        <Footer />
        <button 
          className={styles.chatbotButton} 
          onClick={() => setChatbotOpen(!chatbotOpen)}
        >
          <img src={chatbotLogo} alt="Chat" className={styles.chatbotIcon} />
        </button>
        <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
      </section>
  );
}