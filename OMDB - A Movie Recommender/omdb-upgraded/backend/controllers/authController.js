// controllers/authController.js
const User           = require('../models/User');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, preferences } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    const user = await User.create({
      name, email, password, role: 'user',
      preferences: preferences || { genres: [], languages: ['English'] }
    });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'Registration successful!', token, user: user.toPublicJSON() });
  } catch (err) { next(err); }
};

// POST /api/auth/login  (users + admins share this endpoint)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = generateToken(user._id);
    res.json({ success: true, message: 'Login successful!', token, user: user.toPublicJSON() });
  } catch (err) { next(err); }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (err) { next(err); }
};

// PUT /api/auth/preferences
const updatePreferences = async (req, res, next) => {
  try {
    const { genres, languages } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'preferences.genres': genres, 'preferences.languages': languages },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Preferences updated!', user: user.toPublicJSON() });
  } catch (err) { next(err); }
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, avatar }, { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated!', user: user.toPublicJSON() });
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, updatePreferences, updateProfile };
