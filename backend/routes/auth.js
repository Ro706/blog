const express = require('express');
const User = require('../models/User');
const {body,ValidationResult}= require('express-validator');
const router = express.Router();

// create a user using :POST "/api/auth"
router.post('/',[
    body('name').isString().withMessage('Name must be a string'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res) => {
    const errors = ValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = new User(req.body);
    user.save()
        .then(() => res.status(201).json({ message: 'User created successfully' }))
        .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;