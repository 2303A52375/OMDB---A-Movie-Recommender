// models/Movie.js — Movie schema (supports both OMDB-referenced & admin-added movies)
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  // OMDB reference (only for OMDB-sourced movies saved to DB)
  imdbID: {
    type:   String,
    unique: true,
    sparse: true
  },
  title: {
    type:     String,
    required: [true, 'Movie title is required'],
    trim:     true,
    index:    true
  },
  overview: {
    type:    String,
    default: 'No description available.'
  },
  genres: {
    type:  [String],
    default: [],
    index: true
  },
  language: {
    type:    String,
    default: 'English',
    enum: ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Japanese' , 'Others']
  },
  releaseYear: {
    type: Number
  },
  rating: {
    type:    Number,
    min:     0,
    max:     10,
    default: 0
  },
  posterPath: {
    type:    String,
    default: ''
  },
  director: {
    type:    String,
    default: 'Unknown'
  },
  cast: {
    type:    [String],
    default: []
  },
  runtime: {
    type:    Number,
    default: 0
  },
  // Admin-added flag
  addedByAdmin: {
    type:    Boolean,
    default: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User'
  },
  trending: {
    type:    Boolean,
    default: false
  },
  popularity: {
    type:    Number,
    default: 0
  }
}, { timestamps: true });

movieSchema.index({ title: 'text', overview: 'text', director: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
