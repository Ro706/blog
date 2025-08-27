const express = require('express');
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
      const user = new User(req.body);
      await user.save();

      // Send response without the "user" wrapper
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phonenumber: user.phonenumber,
        date: user.date,
      });
      console.log('User created:', user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
