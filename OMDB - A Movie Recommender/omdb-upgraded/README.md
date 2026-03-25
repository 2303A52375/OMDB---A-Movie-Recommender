# OMDB Movie Recommender v2.0 — Upgraded

## What's New in v2.0

- ✅ Admin Panel with full CRUD (Add / Edit / Delete movies)
- ✅ Admin Login page (`#admin-login`)
- ✅ Admin Dashboard with stats, movie table, user list
- ✅ Add Movie / Edit Movie forms
- ✅ Role-based auth: `admin` vs `user`
- ✅ All admin movies stored in **MongoDB Compass** (`omdb_movies_db`)
- ✅ DB movies displayed as "Editor's Picks" on the dashboard
- ✅ Search combines OMDB results + DB movies
- ✅ Original OMDB search, trending, recommendations — **100% preserved**

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (MongoDB Compass or mongod service)

### 1. Install backend dependencies
```bash
cd backend
npm install
```

### 2. Configure environment (optional)
Edit `backend/.env` — defaults already set:
```
MONGO_URI=mongodb://127.0.0.1:27017/omdb_movies_db
JWT_SECRET=omdb_super_secret_jwt_key_2024_change_in_production
OMDB_API_KEY=a29b2451
PORT=5000
```

### 3. Start MongoDB
Make sure MongoDB is running locally on port 27017.
You can verify in MongoDB Compass by connecting to `mongodb://127.0.0.1:27017`

### 4. Start the server
```bash
cd backend
npm run dev     # development (nodemon)
# or
npm start       # production
```

### 5. Open the app
Visit: **http://localhost:5000**

---

## Creating an Admin Account

1. Register a normal user account at `#register`
2. Open **MongoDB Compass** → connect to `mongodb://127.0.0.1:27017`
3. Select database `omdb_movies_db` → collection `users`
4. Find your user document and edit `role` from `"user"` to `"admin"`
5. Save the change
6. Log in via the **Admin Login** page (`#admin-login`)

---

## Routes

### API Endpoints
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login (users + admins) |
| GET | `/api/auth/me` | Private | Get current user |
| GET | `/api/movies` | Public | Get admin-added movies |
| GET | `/api/movies/search?q=` | Public | Search DB movies |
| GET | `/api/admin/movies` | Admin | List all admin movies |
| POST | `/api/admin/movie` | Admin | Add new movie |
| PUT | `/api/admin/movie/:id` | Admin | Edit movie |
| DELETE | `/api/admin/movie/:id` | Admin | Delete movie |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/stats` | Admin | Dashboard stats |

### Frontend Pages (hash routing)
| Hash | Page |
|------|------|
| `#landing` | Home |
| `#login` | User Login |
| `#register` | Register |
| `#admin-login` | Admin Login |
| `#dashboard` | Movie Dashboard (OMDB) |
| `#movies` | DB Curated Movies |
| `#profile` | User Profile |
| `#admin-dashboard` | Admin Panel |
| `#add-movie` | Add Movie Form |
| `#edit-movie` | Edit Movie Form |

---

## Project Structure

```
omdb-upgraded/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin CRUD
│   │   ├── authController.js     # Auth logic
│   │   ├── movieController.js    # DB movie queries
│   │   └── watchlistController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT protect + adminOnly
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Movie.js              # Movie schema (with addedByAdmin flag)
│   │   ├── User.js               # User schema (with role field)
│   │   └── Watchlist.js
│   ├── routes/
│   │   ├── admin.js              # /api/admin/*
│   │   ├── auth.js               # /api/auth/*
│   │   ├── movies.js             # /api/movies/*
│   │   └── watchlist.js          # /api/watchlist/*
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    └── index.html                # Single-page app (all original OMDB + new admin pages)
```
