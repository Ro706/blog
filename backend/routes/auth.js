const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth
router.post(
  '/',
  [
    body('name').isString().withMessage('Name must be a string'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser){
        return res.status(400).json({ error: 'User already exists' });
      }
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      res.status(201).json({ user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
