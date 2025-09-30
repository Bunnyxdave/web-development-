// StockGraph.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './StockGraph.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const StockGraph = ({ stockName }) => {
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stockName) return;

    const fetchData = async () => {
      setError("");
      try {
        const res = await fetch(`http://localhost:5000/api/stock/${stockName}`);
        const result = await res.json();

        if (!result.data || !Array.isArray(result.data)) {
          setError("⚠️ Unexpected API response format.");
          return;
        }

        const dates = result.data.map(item => item.date);
        const prices = result.data.map(item => item.close);

        setGraphData({
          labels: dates,
          datasets: [
            {
              label: `Closing Price (${stockName})`,
              data: prices,
              fill: false,
              borderColor: '#36a2eb',
              tension: 0.2,
            }
          ]
        });
      } catch (err) {
        console.error(err);
        setError("❌ Unable to fetch stock data.");
      }
    };

    fetchData();
  }, [stockName]);

  return (
    <div className="stock-graph-container">
      {error && <p className="error-message">{error}</p>}
      {graphData ? (
        <Line data={graphData} />
      ) : (
        !error && <p>Enter a valid stock name to load graph</p>
      )}
    </div>
  );
};

export default StockGraph;
