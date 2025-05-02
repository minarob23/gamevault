
import styles from './Grid.module.css';
import React, { useEffect } from 'react';
import Card from '../Card/Card';

const Grid = props => {
    const {
        shownGames,
        reviewDisplay,
        handleLike,
        handleHoverGame,
        hoverState,
        handleAddToCart,
        grid,
        search,
        searching,
        handleSelectGame,
        cartDisplayed,
        currentFilter
    } = props;

    useEffect(() => {
        if (grid === false) {
            if (document.getElementsByClassName('gridContainer')) {
                let grid = document.getElementById('gridContainer')
                grid.className = styles.noGrid
            }
        } else if (grid) {
            if (document.getElementById('gridContainer').className === styles.noGrid) {
                let grid = document.getElementById('gridContainer')
                grid.className = styles.gridContainer
            }
        }
    }, [grid])

    return (
    <>
          <div className={styles.reviews} style={{ display: reviewDisplay && (!shownGames || (shownGames && shownGames.length === 0)) ? "flex" : "none" }}>
              <h2>There are no reviews yet!</h2>
              <h3>You can add some, soon.</h3>
          </div>
          <div className={styles.gridContainer} style={{ display: reviewDisplay && shownGames && shownGames.length > 0 ? "grid" : "none" }} id="gridContainer">
            {shownGames && shownGames.map((game) => (
              <Card 
                game={game} 
                key={game.name} 
                handleLike={handleLike} 
                handleHoverGame={handleHoverGame} 
                handleAddToCart={handleAddToCart} 
                handleSelectGame={handleSelectGame}
                hoverState={hoverState}
              />
            ))}
          </div>
          <div className={styles.reviews} style={{ display: !reviewDisplay && (!shownGames || (shownGames && shownGames.length === 0)) ? "flex" : "none" }}>
              <h2>{currentFilter === "Wishlist" ? "There are no wishlists yet!" : "There are no ratings yet!"}</h2>
              <h3>You can add some, soon.</h3>
          </div>
          <div className={styles.gridContainer} style={{ display: reviewDisplay ? "none" : "grid" }} id="gridContainer">
            {!searching ? 
              (shownGames && shownGames.map((game) => (
                <Card 
                  game={game} 
                  key={game.name} 
                  handleLike={handleLike} 
                  handleHoverGame={handleHoverGame} 
                  handleAddToCart={handleAddToCart} 
                  handleSelectGame={handleSelectGame}
                  hoverState={hoverState}
                />
              ))) : 
              (shownGames && shownGames.map((game) => (
                game.name.toLowerCase().includes(search.toLowerCase()) ? (
                  <Card 
                    game={game} 
                    key={game.name} 
                    handleLike={handleLike} 
                    handleHoverGame={handleHoverGame} 
                    handleAddToCart={handleAddToCart} 
                    handleSelectGame={handleSelectGame}
                    hoverState={hoverState}
                  />
                ) : null
              )))
            }
          </div>
    </>
    );
}

export default Grid;
