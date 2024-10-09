import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ month }) => {
  const [data, setData] = useState([]);

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pie-chart', {
        params: { month }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [month]);

  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF8A80'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
