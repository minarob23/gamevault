import styles from './Browse.module.css';
import React, { useEffect, useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
// eslint-disable-next-line
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../AnimatedPage/AnimatedPage';
import Filters from '../../Components/Filters/Filters';
import Grid from '../../Components/Grid/Grid';
import Cart from '../../Components/Cart/Cart';
import Footer from '../../Components/Footer/Footer';
import Chatbot from '../../Components/Chatbot/Chatbot';
import chatbotLogo from '../../Resources/image/chatbot_logo.png';

const Browse = props => {
  const { 
          handleHover,
          handleSelect,
          hoverState,
          currentFilter,
          shownGames,
          setShownGames,
          clearFilter,
          setReviewDisplay,
          reviewDisplay,
          allGames,
          // eslint-disable-next-line
          setAllGames,
          handleLike,
          handleHoverGame,
          cart,
          cartAmount,
          handleAddToCart,
          handleSelectGame,
          handleSearch,
          handleSearchSubmit,
          search,
          searching,
          browsing,
          handleBrowse,
          handleHome,
          handleOpenCart,
          handleCloseCart,
          cartDisplayed,
          clearCart,
          handleRemoveFromCart,
          setHoverState,
          openGamePage
        } = props;

    // eslint-disable-next-line
    const [grid] = useState(true);
    const [chatbotOpen, setChatbotOpen] = useState(false);


    useEffect(() => {
      if (currentFilter === "none") {
        setShownGames(allGames.filter(game => !game.isHidden));

      } else if (currentFilter !== "Ratings" && currentFilter !== "Reviews" && currentFilter !== "Wishlist") {
          let filteredShownGames = allGames.filter(game => game.genre === currentFilter);
          setShownGames(filteredShownGames);

      } else if (currentFilter === "Ratings") {
          let filteredShownGames = allGames.filter(game => game.isLiked === true);
          filteredShownGames = filteredShownGames.sort(function(a, b) {
            return b.rating - a.rating;
          })
          setShownGames(filteredShownGames);

      } else if (currentFilter === "Reviews") {
          let filteredShownGames = allGames.filter(game => game.reviewAdded === true);
          setShownGames(filteredShownGames);
          setReviewDisplay(true);

      } else if (currentFilter === "Wishlist") {
          let filteredShownGames = allGames.filter(game => game.isLiked === true);
          setShownGames(filteredShownGames);
      }

      if (currentFilter !== "Reviews") {
          setReviewDisplay(false);
      }
    }, [currentFilter, allGames, setShownGames, setReviewDisplay]);

    useEffect(() => {
      if (cartDisplayed) {
        document.body.style.overflow = "hidden";   
      } else {
        document.body.style.overflow = "scroll";
      }
    }, [cartDisplayed]);

    useEffect(() => {
      let unhoveredState = hoverState.map((element, i) => {
        if (i >= 25) {
          return element;
        }
        element.hovered = false;
        return element;
      });

      setHoverState(unhoveredState);
    }, [hoverState, setHoverState]);

    return (
      <section className={styles.Browse} style={{ maxHeight: cartDisplayed ? "100vh" : "1000vh", minHeight: "100vh" }}>
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

        <NavBar
          handleHover={handleHover}
          hoverState={hoverState}
          handleBrowse={handleBrowse}
          handleHome={handleHome}
          browsing={browsing}
          landingPage={false}
          cartAmount={cartAmount}
          search={search}
          searching={searching}
          handleSearch={handleSearch}
          handleSearchSubmit={handleSearchSubmit}
          handleOpenCart={handleOpenCart}
        />

        <AnimatedPage exitBeforeEnter>
            <div className={styles.browseContent}>
              <Filters 
                hoverState={hoverState}
                handleHover={handleHover}
                handleSelect={handleSelect}
                currentFilter={currentFilter} 
              />

              <div className={styles.list}>
                <h1>Popular and Engaging</h1>
                <p>Based on player counts and ratings</p>

                <div className={styles.applied}>
                  <div className={styles.filterList}>
                    <button 
                      className={styles.filterButton} 
                      aria-label="Current Filter"
                    >
                      Filter by:
                      <span> {currentFilter}</span>
                    </button>
                    <button 
                      className={`${styles.filterButton} ${styles.clearButton}`}
                      onClick={clearFilter} 
                      aria-label="Clear Filters"
                    >
                      Clear Filter
                    </button>
                  </div>
                </div>

                    <Grid 
                      shownGames={shownGames}
                      reviewDisplay={reviewDisplay}
                      handleLike={handleLike}
                      handleHoverGame={handleHoverGame}
                      handleAddToCart={handleAddToCart}
                      grid={grid}
                      search={search}
                      searching={searching}
                      handleSelectGame={handleSelectGame}
                      cartDisplayed={cartDisplayed}
                      hoverState={hoverState}
                      currentFilter={currentFilter}
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

  export default Browse;