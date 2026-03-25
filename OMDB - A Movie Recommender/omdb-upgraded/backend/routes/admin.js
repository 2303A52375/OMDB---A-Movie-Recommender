// routes/admin.js — Admin-only routes (protect + adminOnly)
const express = require('express');
const router  = express.Router();
const { getAdminMovies, addMovie, updateMovie, deleteMovie, getUsers, getStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require valid JWT + admin role
router.use(protect, adminOnly);

router.get('/stats',         getStats);
router.get('/movies',        getAdminMovies);
router.post('/movie',        addMovie);
router.put('/movie/:id',     updateMovie);
router.delete('/movie/:id',  deleteMovie);
router.get('/users',         getUsers);

module.exports = router;
