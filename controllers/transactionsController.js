const axios = require('axios');
const Transaction = require('../models/transaction');

// Fetch and store the latest transactions
exports.fetchTransactions = async (req, res) => {
  const { address } = req.params;
  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`
    );

    const transactions = response.data.result.slice(0, 5).map(tx => ({
      address,
      hash: tx.hash,
      value: tx.value,
      timestamp: new Date(tx.timeStamp * 1000),
      blockNumber: tx.blockNumber,
    }));

    await Transaction.insertMany(transactions);

    res.status(200).json({ message: 'Transactions saved', transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Query transactions by address and date range
exports.queryTransactions = async (req, res) => {
  const { address } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const query = { address };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ timestamp: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
