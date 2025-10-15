const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchalluser');


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
const Comment = require('../models/Comment');

// ## Route 1: GET /fetchallblogs
// ## Fetch all blog posts for the authenticated user
router.get('/fetchallblogs', fetchuser, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id }).sort({ date: -1 });

        const blogsWithCommentCounts = await Promise.all(blogs.map(async (blog) => {
            const commentsCount = await Comment.countDocuments({ blog: blog._id });
            return { ...blog.toObject(), commentsCount };
        }));

        res.json(blogsWithCommentCounts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/recentcomments', fetchuser, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id });
        const blogIds = blogs.map(blog => blog._id);

        const comments = await Comment.find({ blog: { $in: blogIds }, seen: false })
            .populate('user', 'name')
            .populate('blog', 'title')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ## Route 1.1: GET /public-blogs
// ## Fetch all public blog posts
router.get('/public-blogs', async (req, res) => {
    try {
        const blogs = await Blog.find({ blogstatus: 'public' })
            .populate('user', 'name') // Populate user's name
            .sort({ date: -1 });

        // Add a placeholder for author profile picture
        const blogsWithAuthor = blogs.map(blog => {
            const blogObject = blog.toObject();
            if (blog.user) {
                blogObject.author = {
                    name: blog.user.name,
                    profilePicture: `https://i.pravatar.cc/150?u=${blog.user._id}`
                };
            } else {
                blogObject.author = {
                    name: 'Unknown Author',
                    profilePicture: 'https://i.pravatar.cc/150'
                };
            }
            return blogObject;
        });

        res.json(blogsWithAuthor);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// ## Route 2: POST /addblog
// ## Create a new blog post with optional image upload
router.post(
    '/addblog',
    fetchuser,
    upload.fields([{ name: 'titleImage', maxCount: 1 }, { name: 'images' }]),
    [
        body('title', 'Enter a valid title').isLength({ min: 3 }),
        body('content', 'Content cannot be empty').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { content, tag, blogstatus } = req.body;
            const title = req.body.title;
            const tagsArray = typeof tag === 'string' ? tag.split(',').map(t => t.trim()) : tag;
            const contentArray = JSON.parse(content);

            let titleImageUrl = '';
            if (req.files.titleImage) {
                const titleImageFile = req.files.titleImage[0];
                const blob = bucket.file(Date.now() + path.extname(titleImageFile.originalname));
                const blobStream = blob.createWriteStream({ resumable: false });

                await new Promise((resolve, reject) => {
                    blobStream.on('error', (err) => reject(err));
                    blobStream.on('finish', () => {
                        titleImageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        resolve();
                    });
                    blobStream.end(titleImageFile.buffer);
                });
            }

            const imageFiles = req.files.images || [];
            let imageIndex = 0;

            const processedContent = [];

            for (const block of contentArray) {
                if (block.type === 'image' && imageFiles && imageFiles[imageIndex]) {
                    const file = imageFiles[imageIndex];
                    const blob = bucket.file(Date.now() + path.extname(file.originalname));
                    const blobStream = blob.createWriteStream({ resumable: false });

                    await new Promise((resolve, reject) => {
                        blobStream.on('error', (err) => reject(err));
                        blobStream.on('finish', () => {
                            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                            processedContent.push({ type: 'image', value: imageUrl });
                            imageIndex++;
                            resolve();
                        });
                        blobStream.end(file.buffer);
                    });
                } else {
                    processedContent.push(block);
                }
            }

            const blog = new Blog({
                title,
                titleImageUrl,
                content: processedContent,
                tag: tagsArray,
                user: req.user.id,
                blogstatus,
            });

            const savedBlog = await blog.save();
            res.status(201).json(savedBlog);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

// ## Route 3: PUT /updateblog/:id
// ## Update an existing blog post for the authenticated user
router.put('/updateblog/:id', fetchuser, upload.fields([{ name: 'titleImage', maxCount: 1 }, { name: 'images' }]), async (req, res) => {
    try {
        const { title, content, tag } = req.body;
        const contentArray = JSON.parse(content);

        const newBlog = {};
        if (title) newBlog.title = title;
        if (tag) newBlog.tag = typeof tag === 'string' ? tag.split(',').map(t => t.trim()) : tag;

        let blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send("Not Found");
        if (blog.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");

        if (req.files.titleImage) {
            const titleImageFile = req.files.titleImage[0];
            const blob = bucket.file(Date.now() + path.extname(titleImageFile.originalname));
            const blobStream = blob.createWriteStream({ resumable: false });

            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => reject(err));
                blobStream.on('finish', () => {
                    newBlog.titleImageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    resolve();
                });
                blobStream.end(titleImageFile.buffer);
            });
        }

        const imageFiles = req.files.images || [];
        let imageIndex = 0;
        const processedContent = [];

        for (const block of contentArray) {
            if (block.type === 'image' && block.value.startsWith('blob:')) { // New image to upload
                const file = imageFiles[imageIndex];
                const blob = bucket.file(Date.now() + path.extname(file.originalname));
                const blobStream = blob.createWriteStream({ resumable: false });

                await new Promise((resolve, reject) => {
                    blobStream.on('error', (err) => reject(err));
                    blobStream.on('finish', () => {
                        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        processedContent.push({ type: 'image', value: imageUrl });
                        imageIndex++;
                        resolve();
                    });
                    blobStream.end(file.buffer);
                });
            } else {
                processedContent.push(block);
            }
        }

        newBlog.content = processedContent;

        blog = await Blog.findByIdAndUpdate(req.params.id, { $set: newBlog }, { new: true });
        res.json(blog);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/togglestatus/:id', fetchuser, async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send("Not Found");
        if (blog.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");

        const newStatus = blog.blogstatus === 'public' ? 'private' : 'public';
        blog = await Blog.findByIdAndUpdate(req.params.id, { $set: { blogstatus: newStatus } }, { new: true });
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

        // Delete images from GCS
        const imageUrls = [];
        if (blog.titleImageUrl) {
            imageUrls.push(blog.titleImageUrl);
        }
        blog.content.forEach(block => {
            if (block.type === 'image') {
                imageUrls.push(block.value);
            }
        });

        for (const imageUrl of imageUrls) {
            try {
                const filename = imageUrl.split('/').pop();
                await bucket.file(filename).delete();
            } catch (error) {
                console.error(`Failed to delete image ${imageUrl}:`, error);
            }
        }

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
        const blog = await Blog.findById(req.params.id).populate('user', 'name');

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

// ## Route to increment view count
router.post('/blog/:id/view', fetchuser, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Not Found");
        }

        if (blog.viewedBy.includes(req.user.id)) {
            return res.status(200).json({ success: true, views: blog.views });
        }

        blog.views += 1;
        blog.viewedBy.push(req.user.id);
        await blog.save();
        res.status(200).json({ success: true, views: blog.views });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// ## Route 6: PUT /:id/like
// ## Like or unlike a blog post
router.put('/:id/like', fetchuser, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Not Found");
        }

        const isLiked = blog.likes.includes(req.user.id);

        if (isLiked) {
            // Unlike the post
            blog.likes.pull(req.user.id);
        } else {
            // Like the post
            blog.likes.push(req.user.id);
        }

        await blog.save();
        res.json(blog);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ## Route 7: GET /:id/comments
// ## Fetch all comments for a blog post
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.id }).populate('user', 'name').sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ## Route 8: POST /:id/comments
// ## Add a comment to a blog post
router.post('/:id/comments', fetchuser, [
    body('text', 'Comment text cannot be empty').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { text, parentCommentId } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Not Found");
        }

        const comment = new Comment({
            text,
            blog: req.params.id,
            user: req.user.id,
            parentComment: parentCommentId
        });

        const savedComment = await comment.save();
        const populatedComment = await savedComment.populate('user', 'name');
        res.status(201).json(populatedComment);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/comments/:commentId', fetchuser, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).send("Not Found");
        }

        const blog = await Blog.findById(comment.blog);
        if (blog.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Find and delete all replies to this comment
        await Comment.deleteMany({ parentComment: comment._id });

        // Delete the comment itself
        await Comment.findByIdAndDelete(req.params.commentId);

        res.json({ success: "Comment has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



router.get('/comments/:commentId', fetchuser, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
            .populate('user', 'name')
            .populate('blog', 'title');
        if (!comment) {
            return res.status(404).send("Not Found");
        }
        res.json(comment);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/comments/:commentId/seen', fetchuser, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).send("Not Found");
        }

        // Check if the user is the author of the blog the comment belongs to
        const blog = await Blog.findById(comment.blog);
        if (blog.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        comment.seen = true;
        await comment.save();
        res.json({ success: "Comment marked as seen" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;