const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
    description: {
        type: String,
        required: true
    },
    tag: {
        type: [String],
        default: ["General"] //this is for multiple tags
    },
    imageUrl: {
        type: String,
        required: false 
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('blog', BlogSchema);