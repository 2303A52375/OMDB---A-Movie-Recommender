// server.js — Main Express server
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const connectDB  = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB Compass (mongodb://127.0.0.1:27017/omdb_movies_db)
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve frontend static files ───────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/movies',    require('./routes/movies'));
app.use('/api/admin',     require('./routes/admin'));
app.use('/api/watchlist', require('./routes/watchlist'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OMDB Movie Recommender API v2 running ✅' });
});

// ── SPA fallback — serve index.html for all non-API routes ───────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 MongoDB: ${process.env.MONGO_URI}`);
  console.log(`🎬 OMDB API key loaded: ${process.env.OMDB_API_KEY ? '✅' : '❌'}\n`);
});
