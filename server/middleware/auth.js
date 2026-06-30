<<<<<<< HEAD
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "shelter")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
=======
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'pawconnect_dev_secret_change_me';

// Protect routes - require a valid JWT
const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Special built-in admin account (not stored in the database)
    if (decoded.id === 'admin') {
      req.user = {
        _id: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin',
        role: 'admin',
      };
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Restrict a route to admin / shelter roles
const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'shelter')) {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
};

module.exports = { protect, admin, JWT_SECRET };
>>>>>>> 6d3a261 (Add backend controllers, routes, auth middleware, and seed data)
