import styles from './Slider.module.css';
import React, { useEffect, useState } from 'react'; // Added useState
import { useLocation } from 'react-router-dom';
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import templateGame from '../../utils/templateGame';

const Slider = props => {
  const {
    selectedGame,
    setSelectedGame,
    allGames,
    carouselState,
    setCarouselState,
    hoverState,
    handleHover
  } = props;

  const slideRef = React.createRef();
  const location = useLocation();
  const [selectedGameIndex, setSelectedGameIndex] = useState(null); // Added state for index

  useEffect(() => {
    const index = allGames.findIndex(game => "/game-ecommerce-store/games/" + game.surname === location.pathname);
    setSelectedGameIndex(index); // Set index in state
  }, [allGames, location.pathname]);

  useEffect(() => {
    if (selectedGameIndex !== null && allGames && allGames[selectedGameIndex]) {
      setSelectedGame(allGames[selectedGameIndex]);
    }
  }, [selectedGameIndex, allGames, setSelectedGame]);


  const properties = {
    duration: 6000,
    autoplay: false,
    transitionDuration: 800,
    arrows: false,
    infinite: true,
    easing: "ease"
  };

  const slideImages = selectedGame && selectedGame.footage ? selectedGame.footage.slice(0,4) : []; //Null check and limit to 4 images.

  const templateImages = templateGame.footage.slice(0,4); //Limit to 4 images


  const back = () => {
    let newIndex = carouselState > 0 ? carouselState - 1 : 3;
    setCarouselState(newIndex);
    slideRef.current.goTo(newIndex); // Directly go to index instead of goBack()
  }

  const next = () => {
    let newIndex = carouselState < 3 ? carouselState + 1 : 0;
    setCarouselState(newIndex);
    slideRef.current.goTo(newIndex); // Directly go to index instead of goNext()
  }

  const jumpToIndex = (e) => {
    const index = parseInt(e.target.id);
    setCarouselState(index);
    slideRef.current.goTo(index);
  }

  return (
        <div className={styles.slider}>
          <Slide ref={slideRef} {...properties}>
            {(selectedGame && slideImages.length > 0) ? slideImages.map((each, index) => (
              <div 
                key={index} 
                className={styles.slide}
              >
                <img 
                  className={styles.currentImg} 
                  src={each} 
                  alt="sample" 
                />
              </div>
            )) : templateImages.map((each, index) => (
              <div 
                key={index} 
                className={styles.slide}
              >
                <img 
                  className={styles.currentImg} 
                  src={each} 
                  alt="sample" 
                />
              </div>
            ))}
          </Slide>

            <button 
              className={styles.backwards} 
              onClick={back} 
              id="22" 
              onMouseEnter={handleHover} 
              onMouseLeave={handleHover} 
              aria-label="Previous Picture"
            >
                <svg className={styles.left} style={{ fill: hoverState[22]?.hovered ? "#fff" : "#ccc" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            <button 
              className={styles.forward} 
              onClick={next} id="23" 
              onMouseEnter={handleHover} 
              onMouseLeave={handleHover} 
              aria-label="Next Picture"
            >
                <svg className={styles.right} style={{ fill: hoverState[23]?.hovered ? "#fff" : "#ccc" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <div className={styles.selectorContainer}>
                <button 
                  id="0" 
                  onClick={jumpToIndex} 
                  className={carouselState === 0 ? styles.buttonSelected : styles.button} 
                  aria-label="Jump to picture"
                >
                </button>
                <button 
                  id="1" 
                  onClick={jumpToIndex} 
                  className={carouselState === 1 ? styles.buttonSelected : styles.button} 
                  aria-label="Jump to picture"
                >
                </button>
                <button 
                  id="2" 
                  onClick={jumpToIndex} 
                  className={carouselState === 2 ? styles.buttonSelected : styles.button} 
                  aria-label="Jump to picture"
                >
                </button>
                <button 
                  id="3" 
                  onClick={jumpToIndex} 
                  className={carouselState === 3 ? styles.buttonSelected : styles.button} 
                  aria-label="Jump to picture"
                >
                </button>
            </div>
        </div>
  );
}

export default Slider;