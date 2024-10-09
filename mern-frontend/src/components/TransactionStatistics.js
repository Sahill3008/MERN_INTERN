import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionStatistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalAmount: 0,
    soldCount: 0,
    notSoldCount: 0,
  });

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/statistics', {
        params: { month }
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  return (
    <div>
      <h3>Transaction Statistics</h3>
      <p>Total Sale Amount: ${statistics.totalAmount}</p>
      <p>Total Sold Items: {statistics.soldCount}</p>
      <p>Total Not Sold Items: {statistics.notSoldCount}</p>
    </div>
  );
};

export default TransactionStatistics;
