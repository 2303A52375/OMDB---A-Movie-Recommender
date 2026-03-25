// controllers/movieController.js
const Movie = require('../models/Movie');

// GET /api/movies  — returns admin-added movies from MongoDB
const getMovies = async (req, res, next) => {
  try {
    const { genre, page = 1, limit = 20 } = req.query;
    const query = { addedByAdmin: true };
    if (genre) query.genres = genre;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [movies, total] = await Promise.all([
      Movie.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Movie.countDocuments(query)
    ]);

    res.json({ success: true, count: movies.length, total, movies });
  } catch (err) { next(err); }
};

// GET /api/movies/search?q=  — search admin movies by title
const searchMovies = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) {
      return res.status(400).json({ success: false, message: 'Search query required.' });
    }
    const regex = new RegExp(q.trim(), 'i');
    const movies = await Movie.find({
      addedByAdmin: true,
      $or: [{ title: regex }, { director: regex }, { cast: regex }]
    }).limit(20);
    res.json({ success: true, count: movies.length, movies });
  } catch (err) { next(err); }
};

// GET /api/movies/genres — distinct genres from admin movies
const getGenres = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genres', { addedByAdmin: true });
    res.json({ success: true, genres: genres.sort() });
  } catch (err) { next(err); }
};

// GET /api/movies/:id
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });
    res.json({ success: true, movie });
  } catch (err) { next(err); }
};

module.exports = { getMovies, searchMovies, getGenres, getMovieById };
