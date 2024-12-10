const express = require('express');
const {
  fetchTransactions,
  queryTransactions,
} = require('../controllers/transactionsController');

const router = express.Router();

router.get('/fetch/:address', fetchTransactions);
router.get('/query/:address', queryTransactions);

module.exports = router;
