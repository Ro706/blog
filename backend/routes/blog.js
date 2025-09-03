const express = require('express');
const {body,validationResult}=require('express-validation')

const router = express.Router();

router.post('/blog', body('title').isString().notEmpty(), body('content').isString().notEmpty(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Handle valid blog post creation
});

module.exports = router;
