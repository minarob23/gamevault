import styles from './Card.module.css';
import React from 'react';
import { ReactComponent as Like } from "../../Resources/image/like.svg";
import { motion } from "framer-motion";
import AddToCart from '../AddToCart/AddToCart';
import AddedToCart from '../AddedToCart/AddedToCart';

const Card = props => {
    const { 
        game,
        handleAddToCart,
        hoverState,
        handleLike,
        handleHoverGame,
        handleSelectGame
      } = props;

    const variants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    }

    return (
          <motion.div 
            className={hoverState[1].selected === false ? styles.card : game.id === 26 ? styles.fifa : game.id === 12 ? styles.tombraider : game.id === 3 ? styles.mariokart : game.id === 11 ? styles.minecraft : styles.cardHome}
            onClick={handleSelectGame}
            id={game.id}
            style={{ margin: 0, padding: 0 }}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <img src={game.cover} className={styles.img} alt={game.name} />

            <div className={styles.price}>
                    {game.inCart ? <AddedToCart /> : <AddToCart 
                                          game={game} 
                                          handleHoverGame={handleHoverGame} 
                                          handleAddToCart={() => {
                                            handleAddToCart({target: {id: game.id}});
                                          }} 
                                        />
                    }
                ${game.price}
            </div>
            <h2 className={styles.name}>{game.name}</h2>
            <div className={styles.details}>
              <span>{game.publishers || 'N/A'}</span>
              <span>{game.developers || 'N/A'}</span>
            </div>
            <button 
              className={styles.like} 
              onClick={(e) => {
                e.stopPropagation();
                handleLike({target: {id: game.id}});
              }} 
              aria-label="Like"
            >
                <Like 
                  style={{ fill: game.isLiked ? "#F53333" : "#cccccc" }} 
                  className={styles.likeSVG}
                />
            </button>
          </motion.div>
    );
  }

  export default Card;