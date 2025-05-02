import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanel.module.css";
import defaultGames from "../../utils/games";
import * as XLSX from "xlsx";
import ReportModal from "../../Components/ReportModal/ReportModal";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [showApiKey, setShowApiKey] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("admin-theme") || "dark",
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    localStorage.setItem("admin-theme", theme);
  }, [theme]);
  const [editingGame, setEditingGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [allGames, setAllGames] = useState([]);
  const [cartDisplayed, setCartDisplayed] = useState(false);
  const [showWishlisted, setShowWishlisted] = useState(false);
  const [showReviewed, setShowReviewed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("name");

  const handleGameClick = (game) => {
    const updatedGame = allGames.find((g) => g.id === game.id);
    if (updatedGame) {
      navigate(`/game-ecommerce-store/games/${updatedGame.surname}`);
    }
  };

  const defaultGame = {
    name: "",
    surname: "",
    price: "",
    desc: "",
    link: "",
    release: "",
    platforms: "",
    genre: "",
    developers: "",
    publishers: "",
    rating: 0,
    cover: "",
    coverUpload: null,
    footage: ["", "", "", ""],
    footageUpload: [null, null, null, null],
    isLiked: false,
    reviews: [],
    isHidden: false,
    inStock: true,
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const storedGames = localStorage.getItem("games");
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!isAdmin) {
      navigate("/game-ecommerce-store/admin/login");
    } else {
      setIsAuthenticated(true);
      if (storedGames) {
        const games = JSON.parse(storedGames);
        const syncedGames = games.map((game) => ({
          ...game,
          inCart: cartItems.some((item) => item.id === game.id),
          inStock: cartItems.some((item) => item.id === game.id), // Set stock based on cart status
        }));
        setAllGames(syncedGames);
        localStorage.setItem("games", JSON.stringify(syncedGames));
      } else {
        const initialGames = defaultGames.map((game) => ({
          ...game,
          inCart: false,
          inStock: false,
        }));
        localStorage.setItem("games", JSON.stringify(initialGames));
        setAllGames(initialGames);
      }
    }
  }, [navigate]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    showToast("Logged out successfully");
    setTimeout(() => {
      navigate("/game-ecommerce-store/admin/login");
    }, 1500);
  };

  const handleInputChange = (e, field) => {
    if (field === "coverUpload" && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingGame({
          ...editingGame,
          cover: reader.result,
          coverUpload: null,
        });
      };
      reader.readAsDataURL(file);
    } else if (field === "cover") {
      const imageUrl = e.target.value;
      setEditingGame({
        ...editingGame,
        cover: imageUrl,
        coverUpload: null,
      });
    } else if (field.startsWith("footageUpload") && e.target.files[0]) {
      const index = parseInt(field.slice(-1));
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFootage = [...editingGame.footage];
        newFootage[index] = reader.result;
        setEditingGame({
          ...editingGame,
          footage: newFootage,
          footageUpload: [...editingGame.footageUpload],
        });
      };
      reader.readAsDataURL(file);
    } else {
      setEditingGame({
        ...editingGame,
        [field]: e.target.value,
      });
    }
  };

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const showToast = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let gameData = { ...editingGame };

    if (!gameData.cover) {
      showToast("Please provide a cover image either through upload or URL");
      return;
    }

    try {
      let updatedGames;
      if (editingGame.id) {
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        const isInCart = cartItems.some((item) => item.id === editingGame.id);

        // Set stock status to true if item is in cart
        gameData.inCart = isInCart;
        gameData.inStock = isInCart ? true : gameData.inStock;

        updatedGames = allGames.map((game) =>
          game.id === editingGame.id ? gameData : game,
        );
        showToast("Game updated successfully");
      } else {
        gameData.id = allGames.length
          ? Math.max(...allGames.map((g) => g.id)) + 1
          : 0;
        gameData.inCart = false;
        gameData.inStock = true;
        updatedGames = [...allGames, gameData];
        showToast("New game added successfully");
      }

      localStorage.setItem("games", JSON.stringify(updatedGames));
      setAllGames(updatedGames);
      setEditingGame(null);
      setShowModal(false);

      // Force analytics update
      if (window.location.pathname.includes("/analytics")) {
        window.location.reload();
      }
    } catch (error) {
      showToast("Error saving game. Please try again.");
    }
  };

  const handleDelete = (gameId) => {
    const gameName = allGames.find((game) => game.id === gameId)?.name;
    try {
      const updatedGames = allGames.filter((game) => game.id !== gameId);
      localStorage.setItem("games", JSON.stringify(updatedGames));
      setAllGames(updatedGames);
      showToast(`${gameName} deleted successfully`);
    } catch (error) {
      showToast(`Error deleting ${gameName}. Please try again.`);
    }
  };

  const handleAddReview = (gameId) => {
    console.log("Adding review for game ID:", gameId);
  };

  const handleRemoveReview = (gameId) => {
    console.log("Removing review for game ID:", gameId);
  };

  const exportInventory = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      allGames.map((game) => ({
        Name: game.name,
        Price: game.price,
        Genre: game.genre,
        Platforms: game.platforms,
        Publisher: game.publishers,
        Developer: game.developers,
        Status: game.inStock ? "In Stock" : "Out of Stock",
      })),
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Games Inventory");
    XLSX.writeFile(workbook, "games_inventory.xlsx");
  };

  const [showReportModal, setShowReportModal] = useState(false);
  const adminDashboardRef = useRef(null);

  const generateReport = () => {
    setShowReportModal(true);
  };

  if (!isAuthenticated) return null;

  return (
    <div
      className={styles.adminPanel}
      data-theme={theme}
      ref={adminDashboardRef}
    >
      {showMessage && <div className={styles.toast}>{message}</div>}
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Admin Panel</h1>
        <div className={styles.searchSection}>
          <button
            onClick={() => navigate("/game-ecommerce-store/admin/analytics")}
            className={styles.analyticsButton}
          >
            View Analytics
          </button>
          <button onClick={exportInventory} className={styles.exportButton}>
            Export Inventory
          </button>
          <button onClick={generateReport} className={styles.reportButton}>
            Create & Preview Report
          </button>
          <button
            className={styles.visitBrowseButton}
            onClick={() => navigate("/game-ecommerce-store/browse")}
          >
            Visit Browse Store
          </button>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="genre">Genre</option>
              <option value="price">Price</option>
              <option value="platforms">Platform</option>
              <option value="publishers">Publisher</option>
              <option value="developers">Designer</option>
            </select>
            <button
              className={styles.feedbackButton}
              onClick={() => navigate("/game-ecommerce-store/admin/feedback")}
            >
              View Feedback
            </button>
          </div>
          <button
            className={styles.notificationButton}
            onClick={() => {
              const stockedGames = allGames.filter((game) => game.inStock);
              setShowModal(true);
              setEditingGame({
                type: "notification",
                items: stockedGames,
              });
            }}
          >
            🔔
            <span className={styles.notificationCount}>
              {allGames.filter((game) => game.inStock).length}
            </span>
          </button>
          <button
            className={styles.themeToggle}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            className={`${styles.chatbotButton} ${localStorage.getItem("chatbot-api-key") ? styles.configured : ""}`}
            onClick={() => {
              setEditingGame({ type: "chatbot-config" });
              setShowModal(true);
            }}
          >
            Configure Chatbot
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Log Out
          </button>
        </div>
      </div>

      <h1 className={styles.mainTitle}>Admin Dashboard</h1>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardStats}>
          <div className={styles.statCard}>
            <h3>Total Games</h3>
            <p>{allGames.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Wishlisted Games</h3>
            <p>{allGames.filter((game) => game.isLiked).length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Games with Reviews</h3>
            <p>{allGames.filter((game) => game.reviewAdded).length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Revenue</h3>
            <p>
              $
              {allGames
                .reduce((acc, game) => {
                  const price = parseFloat(game.price.replace("$", "")) || 0;
                  return acc + price;
                }, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className={styles.statCard}>
            <h3>In Stock Items</h3>
            <p>{allGames.filter((game) => game.inStock).length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Hidden Games</h3>
            <p>{allGames.filter((game) => game.isHidden).length}</p>
          </div>
        </div>
        <div className={styles.mainActions}>
          <button
            className={styles.actionButton}
            onClick={() => {
              setEditingGame(defaultGame);
              setShowModal(true);
            }}
          >
            Add New Game
          </button>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/game-ecommerce-store/admin/analytics")}
          >
            View Analytics
          </button>
          <button
            className={`${styles.actionButton} ${cartDisplayed ? styles.active : ""}`}
            onClick={() => setCartDisplayed(!cartDisplayed)}
          >
            {cartDisplayed ? "Show All Games" : "Show Hidden Games"}
          </button>
          <button
            className={`${styles.actionButton} ${showWishlisted ? styles.active : ""}`}
            onClick={() => setShowWishlisted(!showWishlisted)}
          >
            {showWishlisted ? "Hide Wishlisted Games" : "Show Wishlisted Games"}
          </button>
          <button
            className={`${styles.actionButton} ${showReviewed ? styles.active : ""}`}
            onClick={() => setShowReviewed(!showReviewed)}
          >
            {showReviewed ? "Hide Reviewed Games" : "Show Reviewed Games"}
          </button>
          <button
            onClick={() => window.location.reload()}
            className={styles.refreshButtonCircle}
          >
            <img
              src={require(
                `../../Resources/image/${theme === "light" ? "black_refresh.svg" : "white_refresh.svg"}`,
              )}
              alt="Refresh"
              className={styles.refreshIcon}
            />
          </button>
        </div>
      </div>

      {showModal && editingGame && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              {editingGame.type === "notification"
                ? "New Stocked Items"
                : editingGame.type === "chatbot-config"
                  ? "Chatbot Configuration Settings"
                  : "Add New Game"}
            </h2>
            {editingGame?.type === "chatbot-config" ? (
              <div className={styles.chatbotConfig}>
                <h2>Configure Chatbot</h2>
                <p className={styles.configDescription}>
                  Enter your API key to enable AI-powered game recommendations
                  and smart assistance
                </p>
                <div className={styles.configForm}>
                  <div className={styles.inputGroup}>
                    <label>API Key:</label>
                    <div className={styles.apiKeyContainer}>
                      <input
                        type={showApiKey ? "text" : "password"}
                        placeholder="Enter your API key here"
                        defaultValue={
                          localStorage.getItem("openrouter-api-key") || ""
                        }
                        onChange={(e) => {
                          const apiKey = e.target.value.trim();
                          localStorage.setItem("openrouter-api-key", apiKey);
                        }}
                        className={styles.apiKeyInput}
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className={styles.toggleVisibilityBtn}
                      >
                        {showApiKey ? '🔒' : '👁️'}
                      </button>
                    </div>
                    <small className={styles.apiKeyHelp}>
                      The API key will enable smart game suggestions and
                      personalized recommendations
                    </small>
                  </div>
                </div>
                <div className={styles.configActions}>
                  <button
                    onClick={async () => {
                      const apiKey = localStorage.getItem("openrouter-api-key");
                      if (!apiKey || apiKey.trim() === '') {
                        showToast("Please enter a valid API key");
                        return;
                      }

                      try {
                        // Simple API key format validation
                        if (!apiKey.match(/^[A-Za-z0-9_-]{20,}$/)) {
                          showToast("Invalid API key format. Please check your key.");
                          return;
                        }

                        // Store the API key
                        localStorage.setItem("openrouter-api-key", apiKey.trim());
                        showToast("API key saved successfully");
                        setEditingGame(null);
                        setShowModal(false);
                      } catch (error) {
                        console.error("Error saving API key:", error);
                        showToast("Error saving API key. Please try again.");
                      }
                    }}
                    className={styles.configSaveButton}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingGame(null);
                      setShowModal(false);
                    }}
                    className={styles.configCancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : editingGame?.type === "notification" ? (
              <div className={styles.notificationList}>
                {editingGame.items.length > 0 ? (
                  editingGame.items.map((game) => (
                    <div key={game.id} className={styles.notificationItem}>
                      <img
                        src={game.cover}
                        alt={game.name}
                        className={styles.gameImage}
                      />
                      <div className={styles.gameDetails}>
                        <span className={styles.gameName}>{game.name}</span>
                        <span className={styles.gamePrice}>{game.price}</span>
                        <span
                          className={`${styles.stockStatus} ${styles.inStock}`}
                        >
                          In Stock
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No new stocked items available</p>
                )}
                <button
                  onClick={() => {
                    setEditingGame(null);
                    setShowModal(false);
                  }}
                  className={styles.cancelButton}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.gameForm}>
                <div className={styles.basicInfo}>
                  <h3>Basic Information</h3>
                  <div className={styles.formGroup}>
                    <label>Game Name:</label>
                    <input
                      placeholder="Enter game name"
                      value={editingGame.name}
                      onChange={(e) => handleInputChange(e, "name")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>URL Surname:</label>
                    <input
                      placeholder="URL-friendly name"
                      value={editingGame.surname}
                      onChange={(e) => handleInputChange(e, "surname")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Price:</label>
                    <input
                      placeholder="Game price"
                      value={editingGame.price}
                      onChange={(e) => handleInputChange(e, "price")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Description:</label>
                    <textarea
                      placeholder="Game description"
                      value={editingGame.desc}
                      onChange={(e) => handleInputChange(e, "desc")}
                      className={styles.descriptionInput}
                      rows={6}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Website Link:</label>
                    <input
                      placeholder="Game website URL"
                      value={editingGame.link}
                      onChange={(e) => handleInputChange(e, "link")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Release Date:</label>
                    <input
                      placeholder="Release date"
                      value={editingGame.release}
                      onChange={(e) => handleInputChange(e, "release")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Platforms:</label>
                    <input
                      placeholder="Supported platforms"
                      value={editingGame.platforms}
                      onChange={(e) => handleInputChange(e, "platforms")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Genre:</label>
                    <input
                      placeholder="Game genre"
                      value={editingGame.genre}
                      onChange={(e) => handleInputChange(e, "genre")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Developers:</label>
                    <input
                      placeholder="Game developers"
                      value={editingGame.developers}
                      onChange={(e) => handleInputChange(e, "developers")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Publishers:</label>
                    <input
                      placeholder="Game publishers"
                      value={editingGame.publishers}
                      onChange={(e) => handleInputChange(e, "publishers")}
                    />
                  </div>
                </div>

                <div className={styles.mediaSection}>
                  <h3>Media Content</h3>
                  <div className={styles.formGroup}>
                    <label>Cover Image:</label>
                    <input
                      placeholder="Cover image URL"
                      value={editingGame.cover}
                      onChange={(e) => handleInputChange(e, "cover")}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleInputChange(e, "coverUpload")}
                    />
                    {editingGame.cover && (
                      <img
                        src={editingGame.cover}
                        alt="Cover preview"
                        className={styles.imagePreview}
                      />
                    )}
                  </div>

                  <div className={styles.footageSection}>
                    <label>Footer Images:</label>
                    {editingGame.footage.map((url, index) => (
                      <div key={index} className={styles.formGroup}>
                        <input
                          placeholder={`Footer image ${index + 1} URL`}
                          value={url}
                          onChange={(e) =>
                            handleInputChange(e, `footage${index}`)
                          }
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleInputChange(e, `footageUpload${index}`)
                          }
                        />
                        {url && (
                          <img
                            src={url}
                            alt={`Footer ${index + 1} preview`}
                            className={styles.imagePreview}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button type="submit" className={styles.submitButton}>
                    {editingGame.id ? "Update Game" : "Add Game"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGame(null);
                      setShowModal(false);
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className={styles.gamesList}>
        <table className={styles.gamesTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Genre</th>
              <th>Platforms</th>
              <th>Publisher</th>
              <th>Designer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const filtered = allGames.filter((game) => {
                // Filter out the 404 game
                if (game.surname === "404") return false;

                if (cartDisplayed) return game.isHidden;
                if (showWishlisted) return game.isLiked;
                if (showReviewed)
                  return game.reviews && game.reviews.length > 0;
                return !game.isHidden;
              });

              if (filtered.length === 0) {
                return (
                  <tr>
                    <td colSpan="9" className={styles.noGamesMessage}>
                      {showWishlisted
                        ? "No wishlisted games found"
                        : showReviewed
                          ? "No reviewed games found"
                          : "No hidden games found"}
                    </td>
                  </tr>
                );
              }

              return filtered
                .filter((game) =>
                  game[selectedColumn]
                    ?.toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                )
                .map((game) => (
                  <tr key={game.id}>
                    <td>
                      <img
                        src={game.cover}
                        alt={game.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleGameClick(game)}
                      />
                    </td>
                    <td>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleGameClick(game)}
                      >
                        {game.name}
                      </span>
                    </td>
                    <td>{game.price}</td>
                    <td>{game.genre}</td>
                    <td>{game.platforms || "N/A"}</td>
                    <td>{game.publishers || "N/A"}</td>
                    <td>{game.developers || "N/A"}</td>
                    <td>
                      <div
                        className={`${styles.stockStatus} ${game.inStock ? styles.inStock : styles.outOfStock}`}
                      >
                        {game.inStock ? "In Stock" : "Out of Stock"}
                      </div>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => {
                            setEditingGame(game);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(game.id)}>
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            const updatedGames = allGames.map((g) =>
                              g.id === game.id
                                ? { ...g, isHidden: !g.isHidden }
                                : g,
                            );
                            setAllGames(updatedGames);
                            localStorage.setItem(
                              "games",
                              JSON.stringify(updatedGames),
                            );
                          }}
                          style={{
                            backgroundColor: game.isHidden ? "#FF9800" : "",
                          }}
                        >
                          {game.isHidden ? "Show" : "Hide"}
                        </button>

                        <button
                          onClick={() => {
                            const updatedGames = allGames.map((g) =>
                              g.id === game.id
                                ? { ...g, isLiked: !g.isLiked }
                                : g,
                            );
                            setAllGames(updatedGames);
                            localStorage.setItem(
                              "games",
                              JSON.stringify(updatedGames),
                            );
                          }}
                          style={{
                            backgroundColor: game.isLiked ? "#9C27B0" : "",
                          }}
                        >
                          {game.isLiked
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"}
                        </button>
                        <button
                          style={{
                            backgroundColor: game.reviewAdded
                              ? "#E91E63"
                              : "#4CAF50",
                            fontWeight: game.reviewAdded ? "bold" : "normal",
                          }}
                          onClick={() => {
                            if (game.reviewAdded) {
                              handleRemoveReview(game.id);
                            } else {
                              handleAddReview(game.id);
                            }
                            const updatedGames = allGames.map((g) =>
                              g.id === game.id
                                ? { ...g, reviewAdded: !g.reviewAdded }
                                : g,
                            );
                            setAllGames(updatedGames);
                            localStorage.setItem(
                              "games",
                              JSON.stringify(updatedGames),
                            );
                          }}
                        >
                          {game.reviewAdded ? "Remove Review" : "Add Review"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
            })()}
          </tbody>
        </table>
      </div>
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          adminDashboardRef={adminDashboardRef}
          allGames={allGames}
        />
      )}
    </div>
  );
};

export default AdminPanel;
