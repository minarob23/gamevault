import React, { useState } from "react";
import styles from "./VGSalesPredict.module.css";

const VGSalesPredict = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Rank: "",
    Platform: "",
    Year: "",
    Genre: "",
    Publisher: "",
    NA_Sales: "",
    EU_Sales: "",
    JP_Sales: "",
    Other_Sales: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const salesFields = ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"];

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key.replace("_", " ")} is required`;
      }
      if (salesFields.includes(key) && parseFloat(formData[key]) < 0) {
        newErrors[key] = `${key.replace("_", " ")} cannot be negative`;
      }
      if (key === "Year" && parseInt(formData[key]) < 0) {
        newErrors[key] = "Year cannot be negative";
      }
      if (key === "Rank" && parseInt(formData[key]) < 1) {
        newErrors[key] = "Rank must be positive";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setPrediction(null);
      setErrors({});

      const url = `${window.location.protocol}//${window.location.hostname}:5000/predict`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        setErrors({
          submit:
            data.message ||
            `Error: ${response.status} - ${data.error || "Unknown error"}`,
        });
        return;
      }

      if (data.status === "success" && data.prediction !== undefined) {
        // Keep loading state for 5 seconds before showing prediction
        setTimeout(() => {
          setPrediction(data.prediction);
          setIsLoading(false);
        }, 5000);
      } else {
        setErrors({
          submit:
            data.message ||
            "Prediction failed. Please check your input values.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({
        submit: "Connection failed. Please check your network and try again.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure positive values for numeric fields
    const numericFields = [
      "Rank",
      "Year",
      "NA_Sales",
      "EU_Sales",
      "JP_Sales",
      "Other_Sales",
    ];
    let newValue = value;

    if (numericFields.includes(name)) {
      newValue = Math.max(0, parseFloat(value)) || "";
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1>Video Game Sales Prediction</h1>
        <p>Enter game details to predict sales</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Rank</label>
            <input
              type="number"
              name="Rank"
              value={formData.Rank}
              onChange={handleChange}
            />
            {errors.Rank && <span className={styles.error}>{errors.Rank}</span>}
          </div>
          <div className={styles.formGroup}>
            <label>Game Name</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            />
            {errors.Name && <span className={styles.error}>{errors.Name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Platform</label>
            <input
              type="text"
              name="Platform"
              value={formData.Platform}
              onChange={handleChange}
            />
            {errors.Platform && (
              <span className={styles.error}>{errors.Platform}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Year</label>
            <input
              type="number"
              name="Year"
              value={formData.Year}
              onChange={handleChange}
            />
            {errors.Year && <span className={styles.error}>{errors.Year}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Genre</label>
            <input
              type="text"
              name="Genre"
              value={formData.Genre}
              onChange={handleChange}
            />
            {errors.Genre && (
              <span className={styles.error}>{errors.Genre}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Publisher</label>
            <input
              type="text"
              name="Publisher"
              value={formData.Publisher}
              onChange={handleChange}
            />
            {errors.Publisher && (
              <span className={styles.error}>{errors.Publisher}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>NA Sales (millions)</label>
            <input
              type="number"
              step="0.01"
              name="NA_Sales"
              value={formData.NA_Sales}
              onChange={handleChange}
            />
            {errors.NA_Sales && (
              <span className={styles.error}>{errors.NA_Sales}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>EU Sales (millions)</label>
            <input
              type="number"
              step="0.01"
              name="EU_Sales"
              value={formData.EU_Sales}
              onChange={handleChange}
            />
            {errors.EU_Sales && (
              <span className={styles.error}>{errors.EU_Sales}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>JP Sales (millions)</label>
            <input
              type="number"
              step="0.01"
              name="JP_Sales"
              value={formData.JP_Sales}
              onChange={handleChange}
            />
            {errors.JP_Sales && (
              <span className={styles.error}>{errors.JP_Sales}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Other Sales (millions)</label>
            <input
              type="number"
              step="0.01"
              name="Other_Sales"
              value={formData.Other_Sales}
              onChange={handleChange}
            />
            {errors.Other_Sales && (
              <span className={styles.error}>{errors.Other_Sales}</span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Predict Sales
          </button>
          {errors.submit && (
            <div className={styles.error} style={{ marginTop: "10px" }}>
              {errors.submit}
            </div>
          )}
        </form>

        {isLoading ? (
          <div className={styles.prediction}>
            <div className={styles.loadingSpinner}></div>
            <p>Calculating prediction...</p>
          </div>
        ) : (
          prediction !== null && (
            <div className={styles.prediction}>
              <h2>Predicted Sales</h2>
              <p className={styles.predictionValue}>{prediction.toFixed(2)}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default VGSalesPredict;
