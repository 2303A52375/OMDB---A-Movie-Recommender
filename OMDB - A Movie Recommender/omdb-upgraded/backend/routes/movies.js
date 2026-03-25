// routes/movies.js
const express = require('express');
const router  = express.Router();
const { getMovies, searchMovies, getGenres, getMovieById } = require('../controllers/movieController');

router.get('/',        getMovies);
router.get('/search',  searchMovies);
router.get('/genres',  getGenres);
router.get('/:id',     getMovieById);

module.exports = router;
