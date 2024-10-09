import React, { useState } from 'react';
import { Container, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import TransactionTable from './components/TransactionTable';
import TransactionStatistics from './components/TransactionStatistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [month, setMonth] = useState('March');

  return (
    <Container>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>MERN Stack Dashboard</h1>

      <FormControl fullWidth style={{ margin: '20px 0' }}>
        <InputLabel id="month-select-label">Select Month</InputLabel>
        <Select
          labelId="month-select-label"
          id="month-select"
          value={month}
          label="Select Month"
          onChange={(e) => setMonth(e.target.value)}
        >
          <MenuItem value="January">January</MenuItem>
          <MenuItem value="February">February</MenuItem>
          <MenuItem value="March">March</MenuItem>
          <MenuItem value="April">April</MenuItem>
          <MenuItem value="May">May</MenuItem>
          <MenuItem value="June">June</MenuItem>
          <MenuItem value="July">July</MenuItem>
          <MenuItem value="August">August</MenuItem>
          <MenuItem value="September">September</MenuItem>
          <MenuItem value="October">October</MenuItem>
          <MenuItem value="November">November</MenuItem>
          <MenuItem value="December">December</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Show Data for {month}
      </Button>

      <TransactionStatistics month={month} />
      <TransactionTable month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </Container>
  );
};

export default App;
