import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [data, setData] = useState({});

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bar-chart', {
        params: { month }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Items per Price Range',
        data: Object.values(data),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
