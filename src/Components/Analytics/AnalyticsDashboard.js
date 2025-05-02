import React, { useRef, useState, useEffect } from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import styles from './AnalyticsDashboard.module.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = ({ allGames }) => {
  const analyticsDashboardRef = useRef(null);
  const [localGames, setLocalGames] = useState(allGames);

  useEffect(() => {
    // Update local state when games change
    setLocalGames(allGames);

    // Setup interval to check for updates
    const interval = setInterval(() => {
      const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
      if (JSON.stringify(storedGames) !== JSON.stringify(localGames)) {
        setLocalGames(storedGames);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [allGames, localGames]);
  // Calculate platform distribution
  const platformData = allGames.reduce((acc, game) => {
    const platforms = game.platforms.split(',').map(p => p.trim());
    platforms.forEach(platform => {
      acc[platform] = (acc[platform] || 0) + 1;
    });
    return acc;
  }, {});

  // Calculate genre distribution
  const genreData = allGames.reduce((acc, game) => {
    acc[game.genre] = (acc[game.genre] || 0) + 1;
    return acc;
  }, {});

  // Mock revenue data (you can replace with real data)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const revenueData = allGames.map(game => {
    const price = parseFloat(game.price.replace('$', '')) || 0;
    return price;
  });
  const totalRevenue = revenueData.reduce((a, b) => a + b, 0).toFixed(2);

  const stockData = allGames.reduce((acc, game) => {
    acc.inStock = (acc.inStock || 0) + (game.inStock ? 1 : 0);
    acc.outOfStock = (acc.outOfStock || 0) + (!game.inStock ? 1 : 0);
    return acc;
  }, {});

  const reviewsData = allGames.reduce((acc, game) => {
    if (game.reviews && game.reviews.length > 0) {
      acc.withReviews = (acc.withReviews || 0) + 1;
    } else {
      acc.withoutReviews = (acc.withoutReviews || 0) + 1;
    }
    return acc;
  }, {});

  // Calculate monthly revenue data
  const monthlyRevenue = allGames.reduce((acc, game) => {
    const price = parseFloat(game.price.replace('$', '')) || 0;
    const month = new Date().getMonth(); // Using current month for demo
    acc[months[month]] = (acc[months[month]] || 0) + price;
    return acc;
  }, {});

  // Calculate inventory by genre
  const inventoryByGenre = allGames.reduce((acc, game) => {
    if (!acc[game.genre]) {
      acc[game.genre] = { inStock: 0, outOfStock: 0 };
    }
    if (game.inCart) {
      acc[game.genre].inStock++;
    } else {
      acc[game.genre].outOfStock++;
    }
    return acc;
  }, {});

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#000000' : '#ffffff'
        },
        title: {
          color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#000000' : '#ffffff',
          display: true
        }
      }
    },
    scales: {
      x: {
        ticks: { 
          color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#000000' : '#ffffff'
        },
        grid: {
          color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#e0e0e0' : '#444444'
        }
      },
      y: {
        ticks: { 
          color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#000000' : '#ffffff'
        },
        grid: {
          color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#e0e0e0' : '#444444'
        }
      }
    }
  };

  const chartData = {
    platforms: {
      labels: Object.keys(platformData),
      datasets: [{
        data: Object.values(platformData),
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#9B59B6', '#FFB900', '#2ECC71', '#E74C3C', '#34495E'],
        borderWidth: 2,
        borderColor: document.body.getAttribute('data-theme') === 'light' ? '#2d2d2d' : '#000000',
        hoverOffset: 15,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }]
    },
    genres: {
      labels: Object.keys(genreData),
      datasets: [{
        data: Object.values(genreData),
        backgroundColor: ['#845EC2', '#D65DB1', '#FF6F91', '#FF9671', '#FFC75F', '#F9F871'],
        borderWidth: 2,
        borderColor: '#2a2a2a',
        hoverOffset: 15,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }]
    },
    revenue: {
      labels: months,
      datasets: [{
        label: 'Revenue ($)',
        data: months.map(month => monthlyRevenue[month] || 0),
        borderColor: '#6A0DAD',
        backgroundColor: 'rgba(106, 13, 173, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    inventory: {
      labels: Object.keys(inventoryByGenre),
      datasets: [
        {
          label: 'In Stock',
          data: Object.values(inventoryByGenre).map(g => g.inStock),
          backgroundColor: '#32CD32',
        },
        {
          label: 'Out of Stock',
          data: Object.values(inventoryByGenre).map(g => g.outOfStock),
          backgroundColor: '#FF6B6B',
        }
      ]
    }
  };

  return (
    <div className={styles.dashboard} ref={analyticsDashboardRef}>
      <div className={styles.header}>
        <h2 className={styles.title}>Analytics Dashboard</h2>
        <div className={styles.headerButtons}>
          <div className={styles.totalRevenue}>
            <h3>Total Revenue</h3>
            <p>${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Platform Distribution</h3>
          <Pie data={chartData.platforms} options={chartOptions} />
        </div>
        <div className={styles.chartCard}>
          <h3>Genre Distribution</h3>
          <Pie data={chartData.genres} options={chartOptions} />
        </div>
        <div className={styles.chartCard}>
          <h3>Inventory Status</h3>
          <Bar data={chartData.inventory} options={chartOptions} />
        </div>
        <div className={styles.chartCard}>
          <h3>Revenue Trend</h3>
          <Line data={{
            labels: months,
            datasets: [{
              label: 'Monthly Revenue ($)',
              data: months.map(month => monthlyRevenue[month] || 0),
              fill: true,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: '#4BC0C0',
              tension: 0.4,
              pointBackgroundColor: '#4BC0C0',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#4BC0C0'
            }]
          }} options={{
            ...chartOptions,
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#000000' : '#ffffff'
                }
              },
              title: {
                display: true,
                text: 'Revenue Trend',
                color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#000000' : '#ffffff'
              }
            },
            scales: {
              x: {
                ticks: { 
                  color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#000000' : '#ffffff'
                },
                grid: {
                  color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#e0e0e0' : '#444444'
                }
              },
              y: {
                ticks: { 
                  color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#000000' : '#ffffff'
                },
                grid: {
                  color: ({ chart }) => chart.canvas.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? '#e0e0e0' : '#444444'
                }
              }
            }
          }} />
        </div>
        <div className={styles.chartCard}>
          <h3>Stock Status</h3>
          <Pie data={{
            labels: ['In Stock', 'Out of Stock'],
            datasets: [{
              data: [stockData.inStock, stockData.outOfStock],
              backgroundColor: ['#32CD32', '#FF6B6B'],
              borderColor: document.body.getAttribute('data-theme') === 'light' ? '#2d2d2d' : '#ffffff'
            }]
          }} options={chartOptions}/>
        </div>
        <div className={styles.chartCard}>
          <h3>Reviews Distribution</h3>
          <Pie data={{
            labels: ['With Reviews', 'Without Reviews'],
            datasets: [{
              data: [reviewsData.withReviews, reviewsData.withoutReviews],
              backgroundColor: ['#6A0DAD', '#E0E0E0'],
              borderColor: document.body.getAttribute('data-theme') === 'light' ? '#2d2d2d' : '#ffffff'
            }]
          }} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;