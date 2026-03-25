// controllers/adminController.js — Admin-only CRUD
const Movie = require('../models/Movie');
const User  = require('../models/User');

// ── GET /api/admin/movies ─────────────────────────────────────────────────────
// Returns only admin-added movies (stored in MongoDB)
const getAdminMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ addedByAdmin: true })
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: movies.length, movies });
  } catch (err) { next(err); }
};

// ── POST /api/admin/movie ─────────────────────────────────────────────────────
const addMovie = async (req, res, next) => {
  try {
    const { title, releaseYear, genres, posterPath, cast, overview, rating, director, runtime, language } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required.' });

    const genreArray = Array.isArray(genres)
      ? genres
      : (genres || '').split(',').map(g => g.trim()).filter(Boolean);

    const castArray = Array.isArray(cast)
      ? cast
      : (cast || '').split(',').map(a => a.trim()).filter(Boolean);

    const movie = await Movie.create({
      title,
      releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
      genres:      genreArray,
      posterPath:  posterPath || '',
      cast:        castArray,
      overview:    overview || '',
      rating:      rating   ? parseFloat(rating) : 0,
      director:    director || 'Unknown',
      runtime:     runtime  ? parseInt(runtime)  : 0,
      language:    language || ' ' ,
      addedByAdmin: true,
      addedBy:      req.user._id
    });

    res.status(201).json({ success: true, message: 'Movie added successfully!', movie });
  } catch (err) { next(err); }
};

// ── PUT /api/admin/movie/:id ──────────────────────────────────────────────────
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });

    const { title, releaseYear, genres, posterPath, cast, overview, rating, director, runtime, language } = req.body;

    const genreArray = genres
      ? (Array.isArray(genres) ? genres : genres.split(',').map(g => g.trim()).filter(Boolean))
      : movie.genres;

    const castArray = cast
      ? (Array.isArray(cast) ? cast : cast.split(',').map(a => a.trim()).filter(Boolean))
      : movie.cast;

    movie.title       = title        || movie.title;
    movie.releaseYear = releaseYear  ? parseInt(releaseYear) : movie.releaseYear;
    movie.genres      = genreArray;
    movie.posterPath  = posterPath   !== undefined ? posterPath  : movie.posterPath;
    movie.cast        = castArray;
    movie.overview    = overview     !== undefined ? overview    : movie.overview;
    movie.rating      = rating       !== undefined ? parseFloat(rating)  : movie.rating;
    movie.director    = director     || movie.director;
    movie.runtime     = runtime      ? parseInt(runtime) : movie.runtime;
    movie.language    = language     || movie.language;

    await movie.save();
    res.json({ success: true, message: 'Movie updated successfully!', movie });
  } catch (err) { next(err); }
};

// ── DELETE /api/admin/movie/:id ───────────────────────────────────────────────
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });
    await movie.deleteOne();
    res.json({ success: true, message: 'Movie deleted successfully.' });
  } catch (err) { next(err); }
};

// ── GET /api/admin/users ──────────────────────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) { next(err); }
};

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const [totalMovies, adminMovies, totalUsers, adminUsers] = await Promise.all([
      Movie.countDocuments(),
      Movie.countDocuments({ addedByAdmin: true }),
      User.countDocuments(),
      User.countDocuments({ role: 'admin' })
    ]);
    res.json({ success: true, stats: { totalMovies, adminMovies, totalUsers, adminUsers } });
  } catch (err) { next(err); }
};

module.exports = { getAdminMovies, addMovie, updateMovie, deleteMovie, getUsers, getStats };
