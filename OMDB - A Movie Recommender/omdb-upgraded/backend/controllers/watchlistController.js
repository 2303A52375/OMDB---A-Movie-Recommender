// controllers/watchlistController.js
const Watchlist = require('../models/Watchlist');

const addToWatchlist = async (req, res, next) => {
  try {
    const { movieId, type = 'watchlist' } = req.body;
    const item = await Watchlist.findOneAndUpdate(
      { user: req.user._id, movieId, type },
      { user: req.user._id, movieId, type },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, message: 'Added to list!', item });
  } catch (err) { next(err); }
};

const removeFromWatchlist = async (req, res, next) => {
  try {
    const { type = 'watchlist' } = req.query;
    await Watchlist.findOneAndDelete({ user: req.user._id, movieId: req.params.movieId, type });
    res.json({ success: true, message: 'Removed from list.' });
  } catch (err) { next(err); }
};

const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ user: req.user._id }).sort({ addedAt: -1 });
    res.json({ success: true, items });
  } catch (err) { next(err); }
};

module.exports = { addToWatchlist, removeFromWatchlist, getWatchlist };
