// models/Watchlist.js
const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },   // imdbID or MongoDB _id
  type:    { type: String, enum: ['watchlist', 'favorite', 'liked'], default: 'watchlist' },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

watchlistSchema.index({ user: 1, movieId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
