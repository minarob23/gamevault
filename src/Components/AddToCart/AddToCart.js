import React from 'react';
import styles from './AddToCart.module.css';
import { ReactComponent as Add } from "../../Resources/image/add.svg";

const AddToCart = props => {
    const {
        game,
        handleHoverGame,
        handleAddToCart
    } = props;

    const handleClick = (e) => {
      handleAddToCart(e);
      // Update state immediately
      game.inCart = true;
      game.inStock = true;

      // Update localStorage
      const games = JSON.parse(localStorage.getItem('games') || '[]');
      const updatedGames = games.map(g => 
        g.id === game.id ? { ...g, inStock: true, inCart: true } : g
      );
      localStorage.setItem('games', JSON.stringify(updatedGames));
    };

    return (
          <div className={styles.addToCart} onMouseEnter={handleHoverGame} onMouseLeave={handleHoverGame} id={game.id} onClick={handleClick}>
            <h4 style={{ color: game.isHovered ? "#FF5E4D" : game.inCart ? "#90ee90" : "#d3f800" }}>
              {game.inCart ? "Added" : "Add to cart"}
            </h4>
            <Add 
              className={styles.add} 
              style={{ fill: game.isHovered ? "#FF5E4D" : game.inCart ? "#90ee90" : "#d3f800" }} 
            />
          </div>
    );
  }

  export default AddToCart;