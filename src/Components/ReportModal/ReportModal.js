import React, { useState } from "react";
import styles from "./ReportModal.module.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import AnalyticsDashboard from "../Analytics/AnalyticsDashboard";

const ReportModal = ({ onClose, adminDashboardRef, allGames }) => {
  const [activeTab, setActiveTab] = useState("admin");

  const handleSaveReport = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");

      const contentToCapture = document.getElementById(
        activeTab === "admin" ? "adminPreview" : "analyticsRef",
      );
      if (contentToCapture) {
        const canvas = await html2canvas(contentToCapture, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
          useCORS: true,
        });
        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(
        `${activeTab}_report_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      onClose();
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const renderAdminDashboard = () => {
    return (
      <div id="adminPreview" className={styles.adminPreview}>
        <h2 className={styles.reportTitle}>Admin Dashboard Report</h2>
        <div className={styles.reportDate}>
          Generated on: {new Date().toLocaleDateString()}
        </div>
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
        <div className={styles.gamesTable}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Genre</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allGames.map((game) => (
                <tr key={game.id}>
                  <td>{game.name}</td>
                  <td>{game.price}</td>
                  <td>{game.genre || "N/A"}</td>
                  <td>{game.inStock ? "In Stock" : "Out of Stock"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === "admin" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin Dashboard
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "analytics" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics Dashboard
          </button>
        </div>

        <div className={styles.previewContainer}>
          {activeTab === "admin" ? (
            <div className={styles.previewSection}>
              <h3>Admin Dashboard Preview</h3>
              {renderAdminDashboard()}
            </div>
          ) : (
            <div className={styles.previewSection}>
              <h3>Analytics Dashboard Preview</h3>
              <div className={styles.dashboardPreview}>
                <div className={styles.previewContent} id="analyticsRef">
                  <AnalyticsDashboard allGames={allGames} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button onClick={handleSaveReport} className={styles.saveButton}>
            Save {activeTab === "admin" ? "Admin" : "Analytics"} Report
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
