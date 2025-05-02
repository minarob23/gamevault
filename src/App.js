import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Browse from './Containers/Browse/Browse';
import GamePage from './Containers/GamePage/GamePage';
import NotFound from './Containers/NotFound/NotFound';
import Home from './Containers/Home/Home';
import { AnimatePresence } from "framer-motion";
import GameStoreAuth from './login/login.jsx';
import filterNames from './utils/filterNames';
import defaultGames from './utils/games';
import templateGame from './utils/templateGame';
import AdminPanel from './Containers/Admin/AdminPanel';
import AdminLogin from './Containers/Admin/AdminLogin';
import Analytics from './Containers/Analytics/Analytics';
import Payment from './Components/Payment/Payment';
import FeedbackPage from './Containers/Admin/FeedbackPage';
import VGSalesPredict from './Components/VGSalesPredict/VGSalesPredict';


function App() {
  const [currentFilter, setCurrentFilter] = useState("none");
  const [allGames, setAllGames] = useState(() => {
    const savedGames = localStorage.getItem('games');
    const savedCart = localStorage.getItem('cart');
    const games = savedGames ? JSON.parse(savedGames) : defaultGames;
    const cartItems = savedCart ? JSON.parse(savedCart) : [];

    return games.map(game => ({
      ...game,
      inCart: cartItems.some(cartItem => cartItem.id === game.id)
    }));
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    return parsedCart;
  });
  const [cartAmount, setCartAmount] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart).length : 0;
  });
  const [shownGames, setShownGames] = useState(allGames);
  const [reviewDisplay, setReviewDisplay] = useState(false);
  const [cartDisplayed, setCartDisplayed] = useState(false);
  const [search, setSearch] = useState("");
  const [overlap, setOverlap] = useState(false);
  const [searching, setSearching] = useState(false);
  const [browsing, setBrowsing] = useState(true);
  const [selectedGame, setSelectedGame] = useState(false);
  const [extended, setExtended] = useState(false);
  const [textExtended, setTextExtended] = useState(false);
  const [hoverState, setHoverState] = useState([
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
        hovered: false,
        selected: false
    },
    {
      hovered: false,
      selected: false
    },
    {
      hovered: false,
      selected: false
    },
    {
      hovered: false,
      selected: false
    },
    {
      hovered: false,
      selected: false
    },
    {
      hovered: false,
      selected: false
    },
    {
      hovered: false,
      selected: false
    }
  ]);

const navigate = useNavigate();
const location = useLocation();

if (location.pathname !== "/game-ecommerce-store/" && location.pathname !== "/game-ecommerce-store/browse" && selectedGame === false) {
  let surname = location.pathname.split('/games/')[1];
  let currentGame = allGames.find(game => game.surname === surname);
  if (currentGame !== undefined) {
    setSelectedGame(currentGame);
  } else {
    setSelectedGame(templateGame);
  }
}

async function handleBrowse() {
  setExtended(false);
  setTextExtended(false);
  setCartDisplayed(false);
  setHoverState([...hoverState, hoverState[21].hovered = false]);
  navigate('/game-ecommerce-store/browse');
}

const handleHome = () => {
  setExtended(false);
  setTextExtended(false);
  setCartDisplayed(false);
  setHoverState([...hoverState, hoverState[21].hovered = false]);
  navigate('/game-ecommerce-store/');
}

const handleSearch = (e) => {
  setSearch(e.target.value);
  setSearching(false);
}

const handleSearchSubmit = (e) => {
  setCurrentFilter("none");
  e.preventDefault();
  setSearching(true);

  if (location.pathname !== "/game-ecommerce-store/browse") {
    navigate('/game-ecommerce-store/browse');
  }
}

const handleSelect = (e) => {
  setCurrentFilter(filterNames[e.target.id - 8]);
}

const handleSelectGame = (e) => {
  if (e.target.tagName === "BUTTON") {
    return
  } else if (e.target.classList[0] !== "AddToCart_addToCart__zbJPe") {
        const selectedGame = allGames.find(game => game.id.toString() === e.target.parentNode.id);
        if (selectedGame) {
          setSelectedGame(selectedGame);
          navigate(`/game-ecommerce-store/games/${selectedGame.surname}`);
        } else {
          navigate('/game-ecommerce-store/browse');
        }
  }
}

const handleLike = (e) => {
  let handledLike = allGames.map((game, i) => {
    if (e.target.id === i) {
      game.isLiked = !game.isLiked
      return game
    } else {
      return game;
    }
  });

  setAllGames(handledLike);
}

const clearFilter = () => {
  setCurrentFilter("none");
  setSearch("");
  setReviewDisplay(false);
}

const openGamePage = (e) => {
  setCartDisplayed(false);
  let selectedGameSurname = e.target.id;
  navigate(`/game-ecommerce-store/games/${selectedGameSurname}`);
}

const handleHover = (e) => {
  const targetId = parseInt(e.target.id);

  // Check if hoverState exists and has the target index
  if (!hoverState || !hoverState[targetId]) {
    return;
  }

  // Check if selected property exists
  if (hoverState[targetId].selected) {
    return;
  }

  let newHoverState = hoverState.map((element, i) => {
    if (targetId === i) {
      return { ...element, hovered: !element.hovered };
    }
    return element;
  });

  setHoverState(newHoverState);
}

const handleHoverGame = (e) => {
  let handledHoveredGame = allGames.map((game, i) => {
    if (e.target.id === i) {
      game.isHovered = !game.isHovered
      return game
    } else {
      return game;
    }
  });

  setAllGames(handledHoveredGame);
}

const handleAddToCart = (e) => {
    const targetId = location.pathname === "/game-ecommerce-store/browse" ? 
      parseInt(e.target.id) : selectedGame.id;

    const updatedGames = allGames.map(game => {
      if (game.id === targetId && !game.inCart) {
        const updatedGame = {
          ...game,
          inCart: true,
          inStock: true
        };
        const newCart = [...cart, updatedGame];
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        setCartAmount(cartAmount + 1);
        return updatedGame;
      }
      return game;
    });

    setAllGames(updatedGames);
    localStorage.setItem('games', JSON.stringify(updatedGames));
}

const clearCart = () => {
    setCart([]);
    setCartAmount(0);
    localStorage.removeItem('cart');
    const defaultGames = allGames.map((game, i) => {
      game.inCart = false;
      game.isHovered = false;
      game.inStock = true;
      return game;
    });
    setAllGames(defaultGames);
    let newHoverState = hoverState[21];
    newHoverState.hovered = false;
    setHoverState([
      ...hoverState, hoverState[21] = newHoverState
    ]);
}

const handleRemoveFromCart = (e) => {
  let removedIndex = cart.findIndex(game => game.id === e.target.id);
  let newAllGames = allGames.map((game, i) => {
    if (game.id === e.target.id) {
      game.inCart = false;
      game.isHovered = false;
      game.inStock = true; // Restore stock status when removed from cart
      return game;
    } else {
      return game;
    }
  });
  setAllGames(newAllGames);
  let firstHalf = cart.slice(0, removedIndex);
  let secondHalf = cart.slice(removedIndex + 1);
  let addedUp = firstHalf.concat(secondHalf);
  setCart(addedUp);
  localStorage.setItem('cart', JSON.stringify(addedUp));
  setCartAmount(cartAmount - 1)
  setHoverState([...hoverState, hoverState[21].hovered = false]);
}

useEffect(() => {
  setOverlap(false);

  if (location.pathname === "/game-ecommerce-store/") {
    setBrowsing(false);
  } else {
    setBrowsing(true);
  }

  if (location.pathname !== "/game-ecommerce-store/browse") {
    document.body.style.overflow = "hidden";

  } else if (location.pathname === "/game-ecommerce-store/browse") {
    document.body.style.overflow = "scroll";
  }
}, [location.pathname])

const handleOpenCart = () => {
  setCartDisplayed(true);
}

const handleCloseCart = () => {
  setCartDisplayed(false);
}

useEffect(() => {
  console.log(selectedGame);
}, [selectedGame])

useEffect(() => {
  if (cartDisplayed) {
    document.body.style.overflow = "hidden !important";   
  } else {
    document.body.style.overflow = "scroll !important";
  }
}, [cartDisplayed])

  return (
      <AnimatePresence exitBeforeEnter>
          <Routes key={location.pathname} location={location}>
            <Route path="/game-ecommerce-store/" element={<Home 
                                        handleHover={handleHover} 
                                        hoverState={hoverState} 
                                        shownGames={shownGames} 
                                        cart={cart}
                                        cartAmount={cartAmount}
                                        cartDisplayed={cartDisplayed}
                                        handleOpenCart={handleOpenCart}
                                        handleCloseCart={handleCloseCart}
                                        clearCart={clearCart}
                                        handleAddToCart={handleAddToCart}
                                        handleLike={handleLike}
                                        handleHoverGame={handleHoverGame}
                                        handleSelectGame={handleSelectGame}
                                        handleRemoveFromCart={handleRemoveFromCart}
                                        setHoverState={setHoverState}
                                        overlap={overlap}
                                        setOverlap={setOverlap}
                                        openGamePage={openGamePage}
                                      />} />
            <Route path="/game-ecommerce-store/browse" element={<Browse 
                                              cart={cart}
                                              cartAmount={cartAmount}
                                              handleHover={handleHover} 
                                              handleSelect={handleSelect} 
                                              hoverState={hoverState} 
                                              currentFilter={currentFilter} 
                                              shownGames={shownGames} 
                                              setShownGames={setShownGames} 
                                              clearFilter={clearFilter} 
                                              reviewDisplay={reviewDisplay}
                                              setReviewDisplay={setReviewDisplay}
                                              allGames={allGames}
                                              setAllGames={setAllGames}
                                              handleLike={handleLike}
                                              handleHoverGame={handleHoverGame}
                                              handleAddToCart={handleAddToCart}
                                              handleSelectGame={handleSelectGame}
                                              handleSearch={handleSearch}
                                              handleSearchSubmit={handleSearchSubmit}
                                              search={search}
                                              searching={searching}
                                              browsing={browsing}
                                              handleBrowse={handleBrowse}
                                              handleHome={handleHome}
                                              cartDisplayed={cartDisplayed}
                                              handleOpenCart={handleOpenCart}
                                              handleCloseCart={handleCloseCart}
                                              clearCart={clearCart}
                                              handleRemoveFromCart={handleRemoveFromCart}
                                              setHoverState={setHoverState}
                                              openGamePage={openGamePage}
                                          />} />
            <Route path="/game-ecommerce-store/games/:gameId" element={<GamePage
                                               cart={cart}
                                               cartAmount={cartAmount}
                                               handleHover={handleHover}
                                               hoverState={hoverState}
                                               handleLike={handleLike}
                                               handleAddToCart={handleAddToCart}
                                               handleSelectGame={handleSelectGame} 
                                               selectedGame={selectedGame}
                                               setSelectedGame={setSelectedGame}
                                               handleSearch={handleSearch}
                                               handleSearchSubmit={handleSearchSubmit}
                                               search={search}
                                               searching={searching}
                                               browsing={browsing}
                                               handleBrowse={handleBrowse}
                                               handleHome={handleHome}
                                               setHoverState={setHoverState}
                                               allGames={allGames}
                                               extended={extended}
                                               setExtended={setExtended}
                                               textExtended={textExtended}
                                               setTextExtended={setTextExtended}
                                               cartDisplayed={cartDisplayed}
                                               handleOpenCart={handleOpenCart}
                                               handleCloseCart={handleCloseCart}
                                               clearCart={clearCart}
                                               handleRemoveFromCart={handleRemoveFromCart}
                                               openGamePage={openGamePage}
                                            />} />
            <Route path="/game-ecommerce-store/admin/login" element={<AdminLogin />} />
            <Route path="/game-ecommerce-store/admin" element={<AdminPanel allGames={allGames} setAllGames={setAllGames} />} />
            <Route path="/game-ecommerce-store/admin/analytics" element={<Analytics allGames={allGames} />} />
            <Route path="/game-ecommerce-store/admin/feedback" element={<FeedbackPage />} /> {/* Added feedback route */}
            <Route path="/game-ecommerce-store/vgsales-predict" element={<VGSalesPredict />} />
            <Route path="/game-ecommerce-store/payment" element={<Payment total={cart.reduce((sum, game) => sum + parseFloat(game.price.replace('$', '')), 0)} cart={cart} />} />
            <Route path="*" element={<NotFound 
                            cartDisplayed={cartDisplayed}
                            handleCloseCart={handleCloseCart}
                            handleOpenCart={handleOpenCart}
                            cartAmount={cartAmount}
                            clearCart={clearCart}
                            hoverState={hoverState}
                            handleHome={handleHome}
                            handleHover={handleHover}
                            cart={cart}
                            browsing={browsing}
                            search={search}
                            searching={searching}
                            handleSearch={handleSearch}
                            handleSearchSubmit={handleSearchSubmit}
                            handleBrowse={handleBrowse}
                            handleRemoveFromCart={handleRemoveFromCart}
                            openGamePage={openGamePage}
          />} />
          <Route path="/game-ecommerce-store/login" element={<GameStoreAuth />} />
          </Routes>
      </AnimatePresence>
  );
}

export default App;