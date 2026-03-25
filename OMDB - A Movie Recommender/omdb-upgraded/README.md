# OMDB — A Movie Recommender

A full-stack movie recommendation platform built with Node.js, Express, MongoDB, and vanilla JavaScript. Search millions of movies via the OMDB API, get personalized recommendations, manage your watchlist, and control everything through a role-based admin panel.

---

## Features

- Live Search — real-time OMDB API search with debouncing
- Editor's Picks — admin-curated movies stored in MongoDB
- Personalized Recommendations — genre-based suggestions per user
- Trending Section — hand-picked trending movies
- Watchlist & Favorites — save and manage your movie lists
- Admin Panel — full CRUD dashboard to add, edit, and delete movies
- JWT Authentication — secure login with role-based access (admin / user)
- Multi-language Support — works with Telugu, Hindi, Tamil, Arabic, and any other language
- Responsive Design — mobile-first CSS Grid and Flexbox layout
- Demo Mode — works fully even without a running backend

---

## Project Structure

```
omdb-upgraded/
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB Compass connection
│   ├── controllers/
│   │   ├── adminController.js      # Admin CRUD (movies, users, stats)
│   │   ├── authController.js       # Register, Login, Profile
│   │   ├── movieController.js      # DB movie queries
│   │   └── watchlistController.js  # Favorites & watchlist
│   ├── middleware/
│   │   ├── auth.js                 # JWT protect + adminOnly guard
│   │   └── errorHandler.js         # Global error handler
│   ├── models/
│   │   ├── Movie.js                # Movie schema (addedByAdmin flag)
│   │   ├── User.js                 # User schema (role field)
│   │   └── Watchlist.js            # Watchlist/favorites schema
│   ├── routes/
│   │   ├── admin.js                # /api/admin/*
│   │   ├── auth.js                 # /api/auth/*
│   │   ├── movies.js               # /api/movies/*
│   │   └── watchlist.js            # /api/watchlist/*
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── server.js                   # Entry point
└── frontend/
    └── index.html                  # Complete single-file SPA
```

---

## Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB Community running locally
- MongoDB Compass (optional but recommended for managing data)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

The defaults in `backend/.env` work out of the box:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/omdb_movies_db
JWT_SECRET=omdb_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRES_IN=7d
OMDB_API_KEY=a29b2451
FRONTEND_URL=http://localhost:5000
```

Change `JWT_SECRET` before deploying to production.

### 3. Start MongoDB

```bash
# Windows — start from Services panel, or run:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 4. Start the server

```bash
npm run dev        # Development with auto-restart (nodemon)
npm start          # Production
```

Expected output:

```
Server running at http://localhost:5000
MongoDB: mongodb://127.0.0.1:27017/omdb_movies_db
OMDB API key loaded
MongoDB Connected: 127.0.0.1
```

### 5. Open the app

Visit http://localhost:5000

---

## Creating an Admin Account

There is no hardcoded admin credential. You promote an existing user to admin through MongoDB.

1. Register a normal account at `http://localhost:5000/#register`
2. Open MongoDB Compass and connect to `mongodb://127.0.0.1:27017`
3. Navigate to `omdb_movies_db` → `users` → find your document
4. Edit the `role` field from `"user"` to `"admin"` and save
5. Log in at `http://localhost:5000/#admin-login`

---

## Pages

| Hash | Page | Access |
|---|---|---|
| `#landing` | Home | Public |
| `#login` | User Login | Public |
| `#register` | Register | Public |
| `#admin-login` | Admin Login | Public |
| `#dashboard` | Movie Dashboard (OMDB + DB) | Public |
| `#movies` | Editor's Picks (DB only) | Public |
| `#profile` | User Profile & Preferences | Logged in |
| `#admin-dashboard` | Admin Panel | Admin only |
| `#add-movie` | Add Movie Form | Admin only |
| `#edit-movie` | Edit Movie Form | Admin only |

---

## API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a new user account |
| POST | `/auth/login` | Public | Login and receive JWT token |
| GET | `/auth/me` | JWT | Get current logged-in user |
| PUT | `/auth/preferences` | JWT | Update genre preferences |
| PUT | `/auth/profile` | JWT | Update name and avatar |

Register body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "preferences": {
    "genres": ["Action", "Drama"],
    "languages": ["English"]
  }
}
```

Login response:

```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "Jane Doe", "email": "...", "role": "user" }
}
```

Add the token to all protected requests:

```
Authorization: Bearer <your_token_here>
```

### Movies

| Method | Endpoint | Description |
|---|---|---|
| GET | `/movies` | Admin-added movies (paginated) |
| GET | `/movies/search?q=term` | Search DB movies by title |
| GET | `/movies/genres` | List all genres in DB |
| GET | `/movies/:id` | Single movie detail |

Query parameters for `/movies`:

```
?page=1         Page number (default: 1)
?limit=20       Items per page (default: 20)
?genre=Action   Filter by genre
```

### Admin Routes

All admin routes require a JWT token with `role: "admin"`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Dashboard stats |
| GET | `/admin/movies` | List all admin-added movies |
| POST | `/admin/movie` | Add a new movie |
| PUT | `/admin/movie/:id` | Edit an existing movie |
| DELETE | `/admin/movie/:id` | Delete a movie |
| GET | `/admin/users` | List all registered users |

Add movie body:

```json
{
  "title": "RRR",
  "releaseYear": 2022,
  "rating": 8.0,
  "genres": "Action, Drama",
  "posterPath": "https://example.com/poster.jpg",
  "director": "S. S. Rajamouli",
  "runtime": 182,
  "cast": "N. T. Rama Rao Jr., Ram Charan",
  "language": "Telugu",
  "overview": "A fictitious story about two legendary revolutionaries..."
}
```

### Watchlist

| Method | Endpoint | Description |
|---|---|---|
| GET | `/watchlist` | Get current user's list |
| POST | `/watchlist` | Add a movie to a list |
| DELETE | `/watchlist/:movieId?type=watchlist` | Remove from list |

Types: `"watchlist"`, `"favorite"`, `"liked"`

---

## How Recommendations Work

The recommendation engine lives in `controllers/movieController.js`:

1. Read the user's preferred genres from their profile
2. Find movies matching any preferred genre
3. Exclude movies already saved to the watchlist
4. Sort by rating and popularity score
5. If fewer than 4 results, fill with top-rated fallback movies
6. Apply language filter only if it keeps at least 4 results

This is content-based filtering — simple, transparent, and effective for new users with no watch history.

---

## Architecture

```
Browser (Vanilla JS SPA — frontend/index.html)
          |
          |  REST API calls
          v
  Express.js Server (port 5000)
    |-- /api/auth        --> authController
    |-- /api/movies      --> movieController
    |-- /api/admin       --> adminController
    |-- /api/watchlist   --> watchlistController
          |
          v
    Mongoose ODM
          |
          v
  MongoDB (port 27017)
  Database: omdb_movies_db
```

Pattern: MVC — Models (Mongoose schemas), Views (frontend SPA), Controllers (business logic), Routes (URL mapping), Middleware (JWT auth, error handling).

---

## Security

- Passwords hashed with bcryptjs at 12 salt rounds
- JWT tokens expire in 7 days
- Passwords excluded from all DB query results by default (`select: false`)
- CORS restricted to the configured frontend origin
- `adminOnly` middleware blocks non-admin access to all `/api/admin/*` routes
- Mongoose validation enforced on all inputs
- Stack traces hidden in production via the global error handler

---

## Troubleshooting

**Port already in use (EADDRINUSE: 5000)**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# macOS / Linux
lsof -ti:5000 | xargs kill -9
```

**Error: language override unsupported (e.g. Telugu)**

In `backend/models/Movie.js`, update the text index to be language-agnostic:

```js
movieSchema.index(
  { title: 'text', overview: 'text', director: 'text' },
  { default_language: 'none' }
);
```

Then open MongoDB Compass, go to your `movies` collection, click the Indexes tab, drop the existing text index, and restart the server. The corrected index will be created automatically on startup.

**MongoDB won't connect**

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Start it on Windows
net start MongoDB
```

**JWT errors or user stuck logged out**

Run this in the browser console to clear the stale session:

```js
localStorage.clear()
```

**CORS errors in browser**

- Ensure `FRONTEND_URL` in `.env` matches your frontend URL exactly
- Confirm the backend is running on port 5000

**Movies not showing after search**

- Check the browser console for OMDB API errors
- The OMDB free tier has a daily request limit
- Admin-added movies always load regardless of OMDB API status

---

## Scripts

```bash
npm run dev        # Start with nodemon (auto-restart on file changes)
npm start          # Start in production mode
```

---

## Extending the Project

**Add TMDB live data**

1. Get a free API key at https://www.themoviedb.org/settings/api
2. Add `TMDB_API_KEY=your_key` to `.env`
3. Create `controllers/tmdbController.js` to fetch from TMDB
4. Replace the curated title lists with live trending data

**Add star ratings**

```js
// Extend the Watchlist model
rating: { type: Number, min: 1, max: 5 }
// Use ratings to weight recommendation scoring
```

**Add collaborative filtering**

- Find users with similar genre preference vectors
- Recommend movies liked by similar users
- Weight results by cosine similarity score

**Deploy to production**

- Backend: Railway, Render, or Fly.io
- Frontend: served directly from Express (already configured)
- Database: MongoDB Atlas free tier
- Update `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL` in `.env`

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

Built with Node.js, Express, MongoDB, Vanilla JS, and the OMDB API.
