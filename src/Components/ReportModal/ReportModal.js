
import React, { useState } from "react";
import styles from "./ReportModal.module.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import AnalyticsDashboard from "../Analytics/AnalyticsDashboard";

const ReportModal = ({ onClose, adminDashboardRef, allGames }) => {
  const [activeTab, setActiveTab] = useState("admin");

  const handleSaveReport = async () => {
    try {
      // Wait for charts to fully render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [1200, 1600]
      });

      const contentToCapture = document.getElementById(
        activeTab === "admin" ? "adminPreview" : "analyticsRef"
      );

      if (contentToCapture) {
        // Cache current scroll position
        const scrollPos = window.scrollY;
        
        // Prepare element for capture
        const prevStyle = contentToCapture.style.cssText;
        contentToCapture.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 1200px;
          height: auto;
          transform: none;
          background: white;
        `;

        const canvas = await html2canvas(contentToCapture, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: 1200,
          height: contentToCapture.scrollHeight,
          onclone: (clonedDoc) => {
            const element = clonedDoc.getElementById(
              activeTab === "admin" ? "adminPreview" : "analyticsRef"
            );
            if (element) {
              element.style.width = '100%';
              element.style.height = 'auto';
              element.style.maxHeight = 'none';
              element.style.position = 'relative';
              element.style.overflow = 'visible';
              Array.from(element.getElementsByTagName('canvas')).forEach(canvas => {
                canvas.style.maxWidth = 'none';
                canvas.style.maxHeight = 'none';
              });
            }
          }
        });

        // Restore original state
        contentToCapture.style.cssText = prevStyle;
        window.scrollTo(0, scrollPos);

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;
        let page = 1;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, null, 'FAST');
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft >= 0) {
          position = -pdf.internal.pageSize.getHeight() * page;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, null, 'FAST');
          heightLeft -= pdf.internal.pageSize.getHeight();
          page++;
        }
      }

      pdf.save(
        `${activeTab}_report_${new Date().toISOString().split("T")[0]}.pdf`
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
