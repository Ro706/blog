const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blogstatus:{
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    titleImageUrl: {
        type: String,
        required: false
    },
    content: [
        {
            type: {
                type: String,
                enum: ['text', 'subtitle', 'image'],
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    ],
    tag: {
        type: [String],
        default: ["General"] //this is for multiple tags
    },
    date: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    viewedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('blog', BlogSchema);