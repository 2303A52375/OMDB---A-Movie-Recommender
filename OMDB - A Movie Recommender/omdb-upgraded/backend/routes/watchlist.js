// routes/watchlist.js
const express = require('express');
const router  = express.Router();
const { addToWatchlist, removeFromWatchlist, getWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/',                   getWatchlist);
router.post('/',                  addToWatchlist);
router.delete('/:movieId',        removeFromWatchlist);

module.exports = router;
