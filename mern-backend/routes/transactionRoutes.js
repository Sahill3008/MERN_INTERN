const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Route to initialize the database with seed data
router.get('/init-db', async (req, res) => {
  try {
    // Fetch data from the third-party API
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    
    // Insert the fetched data into the MongoDB collection
    await Transaction.insertMany(data);
    
    res.status(200).send('Database initialized with seed data');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to list transactions with search and pagination
router.get('/transactions', async (req, res) => {
  const { search, page = 1, perPage = 10, month } = req.query;
  
  let query = {};
  if (month) {
    query.dateOfSale = { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-31`) };
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: parseFloat(search) || 0 }
    ];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const count = await Transaction.countDocuments(query);

    res.json({ transactions, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get transaction statistics for a selected month
router.get('/statistics', async (req, res) => {
  const { month } = req.query;
  
  let query = {};
  if (month) {
    query.dateOfSale = { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-31`) };
  }

  try {
    const totalSales = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } }
    ]);

    const soldCount = await Transaction.countDocuments({ ...query, sold: true });
    const notSoldCount = await Transaction.countDocuments({ ...query, sold: false });

    res.json({
      totalAmount: totalSales[0]?.totalAmount || 0,
      soldCount,
      notSoldCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get bar chart data (items in price ranges)
router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;
  
  let query = {};
  if (month) {
    query.dateOfSale = { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-31`) };
  }

  const priceRanges = [
    { range: "0-100", min: 0, max: 100 },
    { range: "101-200", min: 101, max: 200 },
    { range: "201-300", min: 201, max: 300 },
    { range: "301-400", min: 301, max: 400 },
    { range: "401-500", min: 401, max: 500 },
    { range: "501-600", min: 501, max: 600 },
    { range: "601-700", min: 601, max: 700 },
    { range: "701-800", min: 701, max: 800 },
    { range: "801-900", min: 801, max: 900 },
    { range: "901-above", min: 901, max: 10000 }
  ];

  let rangeResults = {};
  
  for (const range of priceRanges) {
    const count = await Transaction.countDocuments({ ...query, price: { $gte: range.min, $lt: range.max } });
    rangeResults[range.range] = count;
  }

  res.json(rangeResults);
});

// Route to get pie chart data (items per category)
router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;
  
  let query = {};
  if (month) {
    query.dateOfSale = { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-31`) };
  }

  try {
    const categories = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
