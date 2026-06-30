const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const { JWT_SECRET } = require('../middleware/auth');

const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

const sanitize = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role: user.role,
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ firstName, lastName, email, password, phone, address });

    res.status(201).json({
      token: generateToken(user._id),
      user: sanitize(user),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Built-in admin account
    if (email === 'admin' && password === 'admin123') {
      return res.json({
        token: generateToken('admin'),
        user: {
          _id: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin',
          role: 'admin',
        },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: sanitize(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };
