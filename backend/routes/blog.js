const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const fetchuser = require('../middleware/fetchuser');


// --- CLOUD STORAGE SETUP ---
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Multer for in-memory file storage to process uploads
const upload = multer({
    storage: multer.memoryStorage(),
});

// Initialize Google Cloud Storage client
const storage = new Storage({
    keyFilename: path.join(__dirname, '../gcp-credentials.json'),
    projectId: process.env.GCP_PROJECT_ID,
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);
// --- END OF CLOUD SETUP ---

// ## Route 1: GET /fetchallblogs
// ## Fetch all blog posts for the authenticated user
router.get('/fetchallblogs', fetchuser, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ## Route 2: POST /addblog
// ## Create a new blog post with optional image upload
router.post(
    '/addblog',
    fetchuser,
    upload.single('image'), // Multer middleware for file handling
    [
        body('title', 'Enter a valid title').isLength({ min: 3 }),
        body('content', 'Content must be at least 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, content, tags } = req.body;
            
            if (req.file) { // If an image is uploaded
                const blob = bucket.file(Date.now() + path.extname(req.file.originalname));
                const blobStream = blob.createWriteStream({ resumable: false });

                blobStream.on('error', (err) => res.status(500).send({ message: err.message }));

                blobStream.on('finish', async () => {
                    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    const blog = new Blog({ title, content, tags, imageUrl, user: req.user.id });
                    const savedBlog = await blog.save();
                    res.status(201).json(savedBlog);
                });

                blobStream.end(req.file.buffer);
            } else { // If no image is uploaded
                const blog = new Blog({ title, content, tags, user: req.user.id });
                const savedBlog = await blog.save();
                res.status(201).json(savedBlog);
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

// ## Route 3: PUT /updateblog/:id
// ## Update an existing blog post for the authenticated user
router.put('/updateblog/:id', fetchuser, async (req, res) => {
    try {
        const { title, content, tags, imageUrl } = req.body;

        const newBlog = {};
        if (title) newBlog.title = title;
        if (content) newBlog.content = content;
        if (tags) newBlog.tags = tags;
        if (imageUrl !== undefined) newBlog.imageUrl = imageUrl;

        let blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send("Not Found");
        if (blog.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");

        blog = await Blog.findByIdAndUpdate(req.params.id, { $set: newBlog }, { new: true });
        res.json(blog);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ## Route 4: DELETE /deleteblog/:id
// ## Delete an existing blog post for the authenticated user
router.delete('/deleteblog/:id', fetchuser, async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send("Not Found");
        if (blog.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");
        
        // Improvement Opportunity: Delete associated image from GCS bucket here
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ success: "Blog post has been deleted", blog });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ## Route 5: GET /blog/:id
// ## Fetch a single blog post
router.get('/blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send("Not Found");
        }

        if (blog.blogstatus === 'public') {
            return res.json(blog);
        }

        // If the blog is private, check for authentication
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

        if (!token) {
            return res.status(401).send({ error: "Access denied. No token provided." });
        }

        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user;

            // Check if the logged-in user is the owner of the blog
            if (blog.user.toString() !== req.user.id) {
                return res.status(401).send({ error: "Not Allowed" });
            }

            return res.json(blog);
        } catch (error) {
            res.status(401).send({ error: "Access denied. Invalid token." });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;