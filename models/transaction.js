const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  address: String,
  hash: String,
  value: String,
  timestamp: Date,
  blockNumber: String,
});

module.exports = mongoose.model('Transaction', transactionSchema);
